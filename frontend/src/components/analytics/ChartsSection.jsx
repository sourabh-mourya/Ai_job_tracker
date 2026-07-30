import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const COLORS = ['#2563EB', '#EC4899', '#10B981', '#F59E0B', '#8B5CF6', '#06B6D4'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="border border-gray-200 rounded-xl bg-white px-3 py-2 text-xs">
        <p className="font-semibold text-gray-700">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="font-medium">
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function ChartsSection({ monthlyTrend, platformData }) {
  const hasMonthly = monthlyTrend && monthlyTrend.some((d) => d.count > 0);
  const hasPlatform = platformData && platformData.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Monthly Trend Chart */}
      <div className="border border-gray-200 rounded-2xl p-5 bg-white">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Monthly Applications Trend</h3>
        {hasMonthly ? (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyTrend} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="count"
                name="Applications"
                stroke="#2563EB"
                strokeWidth={2}
                dot={{ fill: '#2563EB', r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[200px] flex items-center justify-center text-sm text-gray-400">
            No data yet — upload screenshots to see trends
          </div>
        )}
      </div>

      {/* Platform Distribution Pie Chart */}
      <div className="border border-gray-200 rounded-2xl p-5 bg-white">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Applications by Platform</h3>
        {hasPlatform ? (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={platformData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {platformData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [value, name]}
                contentStyle={{ border: '1px solid #E5E7EB', borderRadius: 12, fontSize: 12 }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 11, color: '#6B7280' }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[200px] flex items-center justify-center text-sm text-gray-400">
            No platform data yet
          </div>
        )}
      </div>
    </div>
  );
}
