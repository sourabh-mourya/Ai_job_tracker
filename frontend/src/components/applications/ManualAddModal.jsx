import { useForm } from 'react-hook-form';
import { Plus } from 'lucide-react';
import axios from 'axios';
import { useAppStore } from '../../store/useAppStore';

const API = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:8000/api' : '/api');
const STATUS_OPTIONS = ['Applied', 'In Review', 'OA Sent', 'Interviewing', 'HR Round', 'Offered', 'Rejected'];

export default function ManualAddModal({ onClose }) {
  const { fetchApplications, fetchAnalytics } = useAppStore();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await axios.post(`${API}/applications`, data);
      await fetchApplications();
      await fetchAnalytics();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to add application');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-gray-700 mb-1.5 block">Company *</label>
          <input
            {...register('company', { required: true })}
            placeholder="e.g. Google"
            className={`w-full border rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all ${errors.company ? 'border-rose-300' : 'border-gray-200'}`}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-700 mb-1.5 block">Role / Position</label>
          <input
            {...register('position')}
            placeholder="e.g. Frontend Engineer"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-gray-700 mb-1.5 block">Date Applied</label>
          <input
            type="date"
            {...register('appliedDate')}
            defaultValue={new Date().toISOString().split('T')[0]}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-700 mb-1.5 block">Status</label>
          <select
            {...register('status')}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          >
            {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-gray-700 mb-1.5 block">Source / Platform</label>
          <input
            {...register('source')}
            placeholder="e.g. LinkedIn"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-700 mb-1.5 block">Location</label>
          <input
            {...register('location')}
            placeholder="e.g. Remote"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      <div className="pt-2 flex items-center space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-xl transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Add Application</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
