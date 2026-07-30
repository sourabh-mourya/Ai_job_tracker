import { Search, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useCallback } from 'react';

const STATUS_OPTIONS = ['all', 'Applied', 'In Review', 'OA Sent', 'Interviewing', 'HR Round', 'Offered', 'Rejected'];
const SOURCE_OPTIONS = ['all', 'LinkedIn', 'Indeed', 'Glassdoor', 'Greenhouse', 'Lever', 'Workday', 'Naukri', 'Internshala', 'Company Website', 'Direct Email'];
const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Date Added' },
  { value: 'appliedDate', label: 'Applied Date' },
  { value: 'company', label: 'Company A–Z' },
];

export default function FiltersBar() {
  const { appFilters, fetchApplications } = useAppStore();

  const update = useCallback((key, value) => {
    fetchApplications({ [key]: value });
  }, [fetchApplications]);

  return (
    <div className="border border-gray-200 rounded-2xl p-4 bg-white">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search company or role..."
            value={appFilters.search}
            onChange={(e) => update('search', e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs border border-gray-200 rounded-xl focus:border-blue-400 transition-colors placeholder-gray-400"
          />
        </div>

        <div className="flex items-center space-x-1.5 text-gray-400">
          <SlidersHorizontal className="w-3.5 h-3.5" />
        </div>

        {/* Status Filter */}
        <select
          value={appFilters.status}
          onChange={(e) => update('status', e.target.value)}
          className="text-xs border border-gray-200 rounded-xl px-3 py-2.5 text-gray-700 focus:border-blue-400 transition-colors"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s}</option>
          ))}
        </select>

        {/* Source Filter */}
        <select
          value={appFilters.source}
          onChange={(e) => update('source', e.target.value)}
          className="text-xs border border-gray-200 rounded-xl px-3 py-2.5 text-gray-700 focus:border-blue-400 transition-colors"
        >
          {SOURCE_OPTIONS.map((s) => (
            <option key={s} value={s}>{s === 'all' ? 'All Platforms' : s}</option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={appFilters.sort}
          onChange={(e) => update('sort', e.target.value)}
          className="text-xs border border-gray-200 rounded-xl px-3 py-2.5 text-gray-700 focus:border-blue-400 transition-colors"
        >
          {SORT_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        {/* Refresh */}
        <button
          onClick={() => fetchApplications({})}
          className="p-2.5 border border-gray-200 rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
          title="Refresh"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
