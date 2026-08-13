export default function StatsPanel({ stats }) {
  if (!stats) return null;

  const cards = [
    { label: "Total Tasks", value: stats.total, color: "bg-primary-600" },
    { label: "Completed", value: stats.completed, color: "bg-emerald-600" },
    { label: "Pending", value: stats.pending, color: "bg-amber-500" },
    { label: "Overdue", value: stats.overdue, color: "bg-rose-600" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-xl p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm"
        >
          <div className={`w-2 h-2 rounded-full ${c.color} mb-2`} />
          <div className="text-2xl font-bold">{c.value}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{c.label}</div>
        </div>
      ))}
      <div className="col-span-2 sm:col-span-4 rounded-xl p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium">Completion rate</span>
          <span className="text-sm font-semibold">{stats.completionRate}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-600 transition-all"
            style={{ width: `${stats.completionRate}%` }}
          />
        </div>
      </div>
    </div>
  );
}
