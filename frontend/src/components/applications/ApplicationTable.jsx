import { useState } from 'react';
import { Pencil, Trash2, ExternalLink, Check, X, Download } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const STATUS_OPTIONS = ['Applied', 'In Review', 'OA Sent', 'Interviewing', 'HR Round', 'Offered', 'Rejected'];
const STATUS_COLORS = {
  'Applied':     'bg-blue-50 text-blue-700 border-blue-200',
  'In Review':   'bg-purple-50 text-purple-700 border-purple-200',
  'OA Sent':     'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Interviewing':'bg-amber-50 text-amber-700 border-amber-200',
  'HR Round':    'bg-orange-50 text-orange-700 border-orange-200',
  'Offered':     'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Rejected':    'bg-rose-50 text-rose-700 border-rose-200',
};

function StatusBadge({ status, id, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(status);

  const save = async () => {
    if (val !== status) await onUpdate(id, { status: val });
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="flex items-center space-x-1">
        <select
          value={val}
          onChange={(e) => setVal(e.target.value)}
          className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:border-blue-400"
          autoFocus
        >
          {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
        </select>
        <button onClick={save} className="p-1 text-emerald-600 hover:text-emerald-700"><Check className="w-3.5 h-3.5" /></button>
        <button onClick={() => setEditing(false)} className="p-1 text-gray-400 hover:text-gray-600"><X className="w-3.5 h-3.5" /></button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className={`text-[11px] font-semibold border px-2.5 py-1 rounded-full cursor-pointer hover:opacity-80 transition-opacity ${STATUS_COLORS[status] || 'bg-gray-50 text-gray-700 border-gray-200'}`}
      title="Click to edit status"
    >
      {status}
    </button>
  );
}

function exportToCSV(data) {
  const headers = ['ID', 'Company', 'Position', 'Date Applied', 'Source', 'Status', 'Location', 'Recruiter', 'Notes'];
  const rows = data.map((a) => [
    a.id, a.company, a.position, a.appliedDate, a.source, a.status, a.location, a.recruiter, a.notes
  ].map((v) => `"${v ?? ''}"`).join(','));
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `job-applications-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ApplicationTable() {
  const { applications, totalApplications, appLoading, appFilters, fetchApplications, updateApplication, deleteApplication } = useAppStore();
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this application?')) return;
    setDeletingId(id);
    await deleteApplication(id);
    setDeletingId(null);
  };

  return (
    <div className="border border-gray-200 rounded-2xl bg-white overflow-hidden">
      {/* Table Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Applications</h3>
          <p className="text-xs text-gray-500 mt-0.5">{totalApplications} total • click status to edit inline</p>
        </div>
        <button
          onClick={() => exportToCSV(applications)}
          disabled={applications.length === 0}
          className="flex items-center space-x-1.5 text-xs font-medium text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-colors disabled:opacity-40"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {appLoading ? (
          <div className="py-16 text-center text-sm text-gray-400">
            <div className="inline-block w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3" />
            <p>Loading applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-400">
            <p className="font-medium text-gray-600">No applications found</p>
            <p className="mt-1">Upload screenshots to get started!</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    {['Date', 'Company', 'Position', 'Source', 'Status', 'Location', ''].map((h) => (
                      <th key={h} className="px-4 py-3 text-left font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{app.appliedDate || '—'}</td>
                      <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap max-w-[160px] truncate">{app.company}</td>
                      <td className="px-4 py-3 text-gray-600 max-w-[180px] truncate">{app.position || '—'}</td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{app.source || '—'}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={app.status} id={app.id} onUpdate={updateApplication} />
                      </td>
                      <td className="px-4 py-3 text-gray-500 max-w-[120px] truncate">{app.location || '—'}</td>

                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleDelete(app.id)}
                            disabled={deletingId === app.id}
                            className="p-1.5 rounded-lg hover:bg-rose-50 text-gray-400 hover:text-rose-600 transition-colors"
                            title="Delete"
                          >
                            {deletingId === app.id
                              ? <div className="w-3.5 h-3.5 border border-rose-500 border-t-transparent rounded-full animate-spin" />
                              : <Trash2 className="w-3.5 h-3.5" />
                            }
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-100">
              {applications.map((app) => (
                <div key={app.id} className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{app.company}</h4>
                      <p className="text-xs text-gray-600 mt-0.5">{app.position || '—'}</p>
                    </div>
                    <StatusBadge status={app.status} id={app.id} onUpdate={updateApplication} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-[11px] text-gray-500">
                    <div>
                      <span className="block font-medium text-gray-400 mb-0.5 uppercase tracking-wider text-[9px]">Date Applied</span>
                      {app.appliedDate || '—'}
                    </div>
                    <div>
                      <span className="block font-medium text-gray-400 mb-0.5 uppercase tracking-wider text-[9px]">Source</span>
                      {app.source || '—'}
                    </div>
                    <div>
                      <span className="block font-medium text-gray-400 mb-0.5 uppercase tracking-wider text-[9px]">Location</span>
                      {app.location || '—'}
                    </div>
                    <div className="flex items-center justify-between">
                        {/* Placeholder to keep layout balanced if needed, or just left empty */}
                        <div />
                      <button
                        onClick={() => handleDelete(app.id)}
                        disabled={deletingId === app.id}
                        className="p-2 rounded-lg bg-gray-50 hover:bg-rose-50 text-gray-400 hover:text-rose-600 transition-colors border border-gray-100"
                      >
                        {deletingId === app.id
                          ? <div className="w-3.5 h-3.5 border border-rose-500 border-t-transparent rounded-full animate-spin" />
                          : <Trash2 className="w-3.5 h-3.5" />
                        }
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
