import { useEffect, useState } from "react";
import api from "../api/axios.js";

const empty = { title: "", description: "", priority: "Medium", category: "General", dueDate: "" };

export default function TaskForm({ task, onClose, onSaved }) {
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [classifying, setClassifying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "Medium",
        category: task.category || "General",
        dueDate: task.dueDate ? task.dueDate.substring(0, 10) : "",
      });
    } else {
      setForm(empty);
    }
  }, [task]);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleAiClassify() {
    if (!form.title) return;
    setClassifying(true);
    try {
      const { data } = await api.post("/ai/classify", {
        title: form.title,
        description: form.description,
      });
      if (data.priority) update("priority", data.priority);
      if (data.category) update("category", data.category);
    } catch {
      // silently ignore, non-critical assist feature
    } finally {
      setClassifying(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = { ...form, dueDate: form.dueDate || null };
      if (task) {
        await api.put(`/tasks/${task._id}`, payload);
      } else {
        await api.post("/tasks", payload);
      }
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save task");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-20">
      <div className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-md p-5 shadow-lg border border-gray-200 dark:border-gray-800">
        <h3 className="font-semibold text-lg mb-3">{task ? "Edit Task" : "New Task"}</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            placeholder="Task title"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-sm"
          />
          <textarea
            placeholder="Description (optional)"
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-sm"
          />

          <button
            type="button"
            onClick={handleAiClassify}
            disabled={!form.title || classifying}
            className="text-xs px-3 py-1.5 rounded-lg bg-primary-50 dark:bg-gray-800 text-primary-700 dark:text-primary-400 border border-primary-200 dark:border-gray-700 disabled:opacity-50"
          >
            {classifying ? "Analyzing..." : "✨ Auto-suggest priority & category"}
          </button>

          <div className="grid grid-cols-2 gap-3">
            <select
              value={form.priority}
              onChange={(e) => update("priority", e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-sm"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <input
              placeholder="Category"
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-sm"
            />
          </div>

          <input
            type="date"
            value={form.dueDate}
            onChange={(e) => update("dueDate", e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-sm"
          />

          {error && <p className="text-sm text-rose-600">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm border border-gray-300 dark:border-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg text-sm bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
