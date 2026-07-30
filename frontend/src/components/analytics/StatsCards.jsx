import { Briefcase, FileText, CalendarCheck, XCircle, Clock, Mail, TrendingUp, BarChart3 } from 'lucide-react';

const cards = [
  { key: 'total',          label: 'Total Applications', icon: Briefcase,    color: 'blue'   },
  { key: 'interviews',     label: 'Interviews',          icon: CalendarCheck,color: 'violet' },
  { key: 'offers',         label: 'Offers',              icon: TrendingUp,   color: 'emerald'},
  { key: 'rejections',     label: 'Rejections',          icon: XCircle,      color: 'rose'   },
  { key: 'pending',        label: 'Pending',             icon: Clock,        color: 'amber'  },
  { key: 'coldEmailsSent', label: 'Cold Emails',         icon: Mail,         color: 'pink'   },
  { key: 'thisWeek',       label: 'This Week',           icon: BarChart3,    color: 'indigo' },
  { key: 'responseRate',   label: 'Response Rate',       icon: FileText,     color: 'teal',  suffix: '%' },
];

const colorMap = {
  blue:   { bg: 'bg-blue-50',   border: 'border-blue-200',  icon: 'text-blue-600',   val: 'text-blue-900'  },
  violet: { bg: 'bg-violet-50', border: 'border-violet-200',icon: 'text-violet-600', val: 'text-violet-900'},
  emerald:{ bg: 'bg-emerald-50',border: 'border-emerald-200',icon:'text-emerald-600',val: 'text-emerald-900'},
  rose:   { bg: 'bg-rose-50',   border: 'border-rose-200',  icon: 'text-rose-600',   val: 'text-rose-900'  },
  amber:  { bg: 'bg-amber-50',  border: 'border-amber-200', icon: 'text-amber-600',  val: 'text-amber-900' },
  pink:   { bg: 'bg-pink-50',   border: 'border-pink-200',  icon: 'text-pink-600',   val: 'text-pink-900'  },
  indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200',icon: 'text-indigo-600', val: 'text-indigo-900'},
  teal:   { bg: 'bg-teal-50',   border: 'border-teal-200',  icon: 'text-teal-600',   val: 'text-teal-900'  },
};

export default function StatsCards({ stats }) {
  if (!stats) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {cards.map((c) => (
          <div key={c.key} className="border border-gray-200 rounded-2xl p-4 bg-white animate-pulse">
            <div className="h-3 bg-gray-200 rounded w-3/4 mb-3" />
            <div className="h-7 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
      {cards.map(({ key, label, icon: Icon, color, suffix }) => {
        const c = colorMap[color];
        const value = stats[key] ?? 0;
        return (
          <div key={key} className={`border ${c.border} rounded-2xl p-4 ${c.bg} hover:border-blue-400 transition-colors`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">{label}</span>
              <Icon className={`w-3.5 h-3.5 ${c.icon}`} />
            </div>
            <div className={`text-2xl font-extrabold ${c.val}`}>
              {value}{suffix || ''}
            </div>
          </div>
        );
      })}
    </div>
  );
}
