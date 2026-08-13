import { useEffect, useState, useCallback } from "react";
import api from "../api/axios.js";
import Navbar from "../components/Navbar.jsx";
import StatsPanel from "../components/StatsPanel.jsx";
import AISummaryPanel from "../components/AISummaryPanel.jsx";
import TaskFilters from "../components/TaskFilters.jsx";
import TaskCard from "../components/TaskCard.jsx";
import TaskForm from "../components/TaskForm.jsx";
import SuggestModal from "../components/SuggestModal.jsx";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({ search: "", status: "", priority: "", category: "" });
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [suggestTask, setSuggestTask] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadTasks = useCallback(async () => {
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
    const { data } = await api.get("/tasks", { params });
    setTasks(data);
  }, [filters]);

  const loadStats = useCallback(async () => {
    const { data } = await api.get("/tasks/stats");
    setStats(data);
  }, []);

  useEffect(() => {
    setLoading(true);
    loadTasks().finally(() => setLoading(false));
  }, [loadTasks]);

  useEffect(() => {
    loadStats();
  }, [loadStats, tasks.length]);

  async function handleToggle(task) {
    await api.patch(`/tasks/${task._id}/toggle`);
    loadTasks();
    loadStats();
  }

  async function handleDelete(task) {
    if (!confirm(`Delete "${task.title}"?`)) return;
    await api.delete(`/tasks/${task._id}`);
    loadTasks();
    loadStats();
  }

  function handleEdit(task) {
    setEditingTask(task);
    setShowForm(true);
  }

  function handleAddNew() {
    setEditingTask(null);
    setShowForm(true);
  }

  function handleFormSaved() {
    setShowForm(false);
    setEditingTask(null);
    loadTasks();
    loadStats();
  }

  const categories = [...new Set(tasks.map((t) => t.category).filter(Boolean))];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-6">
        <StatsPanel stats={stats} />
        <AISummaryPanel />

        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Your Tasks</h2>
          <button
            onClick={handleAddNew}
            className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700"
          >
            + Add Task
          </button>
        </div>

        <TaskFilters filters={filters} setFilters={setFilters} categories={categories} />

        {loading ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No tasks found. Create your first task to get started.
          </p>
        ) : (
          <div className="grid gap-3">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onToggle={handleToggle}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSuggest={setSuggestTask}
              />
            ))}
          </div>
        )}
      </main>

      {showForm && (
        <TaskForm
          task={editingTask}
          onClose={() => setShowForm(false)}
          onSaved={handleFormSaved}
        />
      )}

      {suggestTask && (
        <SuggestModal
          task={suggestTask}
          onClose={() => setSuggestTask(null)}
          onSaved={() => {
            setSuggestTask(null);
            loadTasks();
          }}
        />
      )}
    </div>
  );
}
