import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import StatsCards from '../components/analytics/StatsCards';
import ChartsSection from '../components/analytics/ChartsSection';
import ApplicationTable from '../components/applications/ApplicationTable';
import FiltersBar from '../components/applications/FiltersBar';

export default function Dashboard() {
  const { fetchApplications, fetchColdEmails, fetchAnalytics, analytics } = useAppStore();

  useEffect(() => {
    fetchApplications();
    fetchColdEmails();
    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats Cards Row */}
      <StatsCards stats={analytics?.stats} />

      {/* Charts Row */}
      <ChartsSection
        monthlyTrend={analytics?.monthlyTrend}
        platformData={analytics?.platformData}
      />

      {/* Applications Data Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Job Applications</h2>
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {analytics?.stats?.total || 0} Total
          </span>
        </div>
        
        <FiltersBar />
        <ApplicationTable />
      </div>
    </div>
  );
}
