import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Plus, Bell, Trash2, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:8000/api' : '/api');
const STATUS_OPTIONS = ['Sent', 'Followed Up', 'Response Received', 'No Response', 'Meeting Scheduled'];

export default function ColdEmailModal({ onClose }) {
  const [activeTab, setActiveTab] = useState('add'); // 'add' or 'list'
  const { coldEmails, coldEmailsLoading, addColdEmail, deleteColdEmail, fetchColdEmails } = useAppStore();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    const ok = await addColdEmail(data);
    if (ok) {
      reset();
      setActiveTab('list');
    }
  };

  const toggleResponse = async (email) => {
    try {
      await axios.patch(`${API}/cold-emails/${email.id}`, {
        responseReceived: !email.responseReceived,
        responseDate: !email.responseReceived ? new Date().toISOString().split('T')[0] : null,
        status: !email.responseReceived ? 'Response Received' : 'Sent',
      });
      await fetchColdEmails();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('add')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${activeTab === 'add' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
        >
          New Entry
        </button>
        <button
          onClick={() => setActiveTab('list')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${activeTab === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
        >
          History ({coldEmails.length})
        </button>
      </div>

      {activeTab === 'add' ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Company *</label>
              <input
                {...register('company', { required: true })}
                className={`w-full border rounded-xl px-3 py-2 text-xs focus:border-pink-400 ${errors.company ? 'border-rose-300' : 'border-gray-200'}`}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Date Sent *</label>
              <input
                type="date"
                {...register('sentDate', { required: true })}
                defaultValue={new Date().toISOString().split('T')[0]}
                className={`w-full border rounded-xl px-3 py-2 text-xs focus:border-pink-400 ${errors.sentDate ? 'border-rose-300' : 'border-gray-200'}`}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Recruiter Name</label>
              <input
                {...register('recruiterName')}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:border-pink-400"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Recruiter Email</label>
              <input
                type="email"
                {...register('recruiterEmail')}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:border-pink-400"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Follow-up Date</label>
              <input
                type="date"
                {...register('followUpDate')}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:border-pink-400"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Status</label>
              <select
                {...register('status')}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:border-pink-400"
              >
                {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Notes</label>
            <textarea
              {...register('notes')}
              rows={2}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:border-pink-400 resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {isSubmitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Plus className="w-4 h-4" />}
            <span>Log Email</span>
          </button>
        </form>
      ) : (
        <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {coldEmails.length === 0 ? (
            <div className="py-10 text-center text-gray-400 text-xs">No cold emails logged yet.</div>
          ) : (
            coldEmails.map((email) => (
              <div
                key={email.id}
                className={`border rounded-xl p-3 flex items-start justify-between group ${
                  email.followUpDue && !email.responseReceived ? 'border-amber-200 bg-amber-50' : 
                  email.responseReceived ? 'border-emerald-200 bg-emerald-50' : 'border-gray-200'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold text-gray-900 truncate">{email.company}</span>
                    {email.responseReceived && (
                      <span className="inline-flex items-center space-x-1 text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-2.5 h-2.5" /><span>Responded</span>
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-500 mt-0.5">{email.recruiterName || 'Unknown'} {email.recruiterEmail ? `(${email.recruiterEmail})` : ''}</p>
                </div>
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => toggleResponse(email)} className="p-1 text-gray-400 hover:text-emerald-600"><CheckCircle2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => deleteColdEmail(email.id)} className="p-1 text-gray-400 hover:text-rose-600"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
