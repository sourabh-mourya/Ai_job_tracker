import { create } from 'zustand';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:8000/api' : '/api');

export const useAppStore = create((set, get) => ({
  // ─── Applications State ─────────────────────────────────────────────────────
  applications: [],
  totalApplications: 0,
  appFilters: { search: '', status: 'all', source: 'all', sort: 'createdAt', order: 'desc' },
  appLoading: false,

  // ─── Cold Emails State ───────────────────────────────────────────────────────
  coldEmails: [],
  coldEmailsLoading: false,

  // ─── Analytics State ─────────────────────────────────────────────────────────
  analytics: null,
  analyticsLoading: false,

  // ─── Upload State ─────────────────────────────────────────────────────────────
  uploadQueue: [],   // [{ file, status: 'pending'|'processing'|'done'|'error'|'duplicate', result, error }]
  isUploading: false,

  // ─── Fetch Applications ───────────────────────────────────────────────────────
  fetchApplications: async (filters = {}) => {
    set({ appLoading: true });
    const merged = { ...get().appFilters, ...filters };
    set({ appFilters: merged });
    try {
      const params = new URLSearchParams();
      if (merged.search) params.set('search', merged.search);
      if (merged.status !== 'all') params.set('status', merged.status);
      if (merged.source !== 'all') params.set('source', merged.source);
      params.set('sort', merged.sort);
      params.set('order', merged.order);

      const res = await axios.get(`${API}/applications?${params}`);
      set({ applications: res.data.applications, totalApplications: res.data.total });
    } catch (err) {
      console.error('[Store] fetchApplications:', err.message);
    } finally {
      set({ appLoading: false });
    }
  },

  // ─── Update Application ───────────────────────────────────────────────────────
  updateApplication: async (id, data) => {
    try {
      const res = await axios.patch(`${API}/applications/${id}`, data);
      set((state) => ({
        applications: state.applications.map((a) => (a.id === id ? res.data.application : a)),
      }));
      return true;
    } catch (err) {
      console.error('[Store] updateApplication:', err.message);
      return false;
    }
  },

  // ─── Delete Application ───────────────────────────────────────────────────────
  deleteApplication: async (id) => {
    try {
      await axios.delete(`${API}/applications/${id}`);
      set((state) => ({
        applications: state.applications.filter((a) => a.id !== id),
        totalApplications: state.totalApplications - 1,
      }));
      get().fetchAnalytics();
      return true;
    } catch (err) {
      console.error('[Store] deleteApplication:', err.message);
      return false;
    }
  },

  // ─── Fetch Cold Emails ────────────────────────────────────────────────────────
  fetchColdEmails: async () => {
    set({ coldEmailsLoading: true });
    try {
      const res = await axios.get(`${API}/cold-emails`);
      set({ coldEmails: res.data.coldEmails });
    } catch (err) {
      console.error('[Store] fetchColdEmails:', err.message);
    } finally {
      set({ coldEmailsLoading: false });
    }
  },

  // ─── Add Cold Email ───────────────────────────────────────────────────────────
  addColdEmail: async (data) => {
    try {
      const res = await axios.post(`${API}/cold-emails`, data);
      set((state) => ({ coldEmails: [res.data.coldEmail, ...state.coldEmails] }));
      get().fetchAnalytics();
      return true;
    } catch (err) {
      console.error('[Store] addColdEmail:', err.message);
      return false;
    }
  },

  // ─── Delete Cold Email ────────────────────────────────────────────────────────
  deleteColdEmail: async (id) => {
    try {
      await axios.delete(`${API}/cold-emails/${id}`);
      set((state) => ({ coldEmails: state.coldEmails.filter((e) => e.id !== id) }));
      get().fetchAnalytics();
    } catch (err) {
      console.error('[Store] deleteColdEmail:', err.message);
    }
  },

  // ─── Fetch Analytics ──────────────────────────────────────────────────────────
  fetchAnalytics: async () => {
    set({ analyticsLoading: true });
    try {
      const res = await axios.get(`${API}/analytics`);
      set({ analytics: res.data });
    } catch (err) {
      console.error('[Store] fetchAnalytics:', err.message);
    } finally {
      set({ analyticsLoading: false });
    }
  },

  // ─── Bulk Upload ──────────────────────────────────────────────────────────────
  setBulkQueue: (files) => {
    const queue = files.map((file) => ({ file, status: 'pending', result: null, error: null }));
    set({ uploadQueue: queue });
  },

  startBulkUpload: async () => {
    const queue = get().uploadQueue;
    if (!queue.length) return;
    set({ isUploading: true });

    // Process one by one to avoid Vercel 4.5MB payload limit and 10s timeout
    for (let i = 0; i < queue.length; i++) {
      const item = queue[i];
      if (item.status !== 'pending') continue;

      // Mark current item as processing
      set((state) => ({
        uploadQueue: state.uploadQueue.map((q, idx) => (idx === i ? { ...q, status: 'processing' } : q)),
      }));

      const formData = new FormData();
      formData.append('images', item.file);

      try {
        const res = await axios.post(`${API}/applications/upload-bulk`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const { results, errors } = res.data;
        const success = results.find((r) => r.file === item.file.name);
        const failed = errors.find((e) => e.file === item.file.name);

        set((state) => ({
          uploadQueue: state.uploadQueue.map((q, idx) => {
            if (idx !== i) return q;
            if (success) return { ...q, status: 'done', result: success.data };
            if (failed?.isDuplicate) return { ...q, status: 'duplicate', error: failed.error };
            if (failed) return { ...q, status: 'error', error: failed.error };
            return { ...q, status: 'error', error: 'Unknown error' };
          }),
        }));

        if (failed && !failed.isDuplicate) {
          alert(`Processing stopped due to error: ${failed.error}`);
          break;
        }
      } catch (err) {
        set((state) => ({
          uploadQueue: state.uploadQueue.map((q, idx) => (idx === i ? { ...q, status: 'error', error: err.message } : q)),
        }));
        alert(`Processing stopped due to Server/Network Error: ${err.message}`);
        break;
      }
    }

    // Refresh data after all uploads
    get().fetchApplications();
    get().fetchAnalytics();
    set({ isUploading: false });
  },

  clearUploadQueue: () => set({ uploadQueue: [] }),
}));
