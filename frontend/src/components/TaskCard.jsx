const priorityColor = {
  Low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  Medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  High: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400",
};

export default function TaskCard({ task, onToggle, onEdit, onDelete, onSuggest }) {
  const isOverdue =
    task.status === "Pending" && task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <div className="rounded-xl p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 flex-1">
          <input
            type="checkbox"
            checked={task.status === "Completed"}
            onChange={() => onToggle(task)}
            className="mt-1 w-4 h-4 accent-primary-600 cursor-pointer"
          />
          <div>
            <h4
              className={`font-medium ${
                task.status === "Completed" ? "line-through text-gray-400" : ""
              }`}
            >
              {task.title}
            </h4>
            {task.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {task.description}
              </p>
            )}
          </div>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColor[task.priority]}`}>
          {task.priority}
        </span>
      </div>

      {task.aiSubtasks?.length > 0 && (
        <ul className="ml-6 mt-1 list-disc text-xs text-gray-500 dark:text-gray-400 space-y-0.5">
          {task.aiSubtasks.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      )}

      <div className="flex items-center justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800">
            {task.category}
          </span>
          {task.dueDate && (
            <span className={isOverdue ? "text-rose-600 font-medium" : ""}>
              Due {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => onSuggest(task)} className="hover:text-primary-600" title="AI subtasks">
            ✨ Suggest
          </button>
          <button onClick={() => onEdit(task)} className="hover:text-primary-600">
            Edit
          </button>
          <button onClick={() => onDelete(task)} className="hover:text-rose-600">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
