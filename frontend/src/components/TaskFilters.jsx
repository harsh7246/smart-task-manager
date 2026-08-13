export default function TaskFilters({ filters, setFilters, categories }) {
  function update(key, value) {
    setFilters((f) => ({ ...f, [key]: value }));
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <input
        type="text"
        placeholder="Search tasks..."
        value={filters.search}
        onChange={(e) => update("search", e.target.value)}
        className="flex-1 min-w-[180px] px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
      />
      <select
        value={filters.status}
        onChange={(e) => update("status", e.target.value)}
        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
      >
        <option value="">All statuses</option>
        <option value="Pending">Pending</option>
        <option value="Completed">Completed</option>
      </select>
      <select
        value={filters.priority}
        onChange={(e) => update("priority", e.target.value)}
        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
      >
        <option value="">All priorities</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <select
        value={filters.category}
        onChange={(e) => update("category", e.target.value)}
        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
      >
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  );
}
