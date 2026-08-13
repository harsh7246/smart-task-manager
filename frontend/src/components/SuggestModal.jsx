import { useState } from "react";
import api from "../api/axios.js";

export default function SuggestModal({ task, onClose, onSaved }) {
  const [subtasks, setSubtasks] = useState(task.aiSubtasks || []);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/ai/suggest-subtasks", {
        title: task.title,
        description: task.description,
      });
      setSubtasks(data.subtasks);
    } catch (err) {
      setError(err.response?.data?.message || "Could not generate subtasks");
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    setSaving(true);
    try {
      await api.patch(`/ai/tasks/${task._id}/subtasks`, { subtasks });
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-20">
      <div className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-md p-5 shadow-lg border border-gray-200 dark:border-gray-800">
        <h3 className="font-semibold text-lg mb-1">✨ AI Subtask Suggestions</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{task.title}</p>

        {error && <p className="text-sm text-rose-600 mb-2">{error}</p>}

        {subtasks.length > 0 ? (
          <ul className="list-disc ml-5 space-y-1 text-sm mb-4 max-h-64 overflow-y-auto">
            {subtasks.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            No subtasks yet. Generate a breakdown using Cohere AI.
          </p>
        )}

        <div className="flex justify-between gap-2">
          <button
            onClick={generate}
            disabled={loading}
            className="px-3 py-2 rounded-lg text-sm bg-primary-50 dark:bg-gray-800 text-primary-700 dark:text-primary-400 border border-primary-200 dark:border-gray-700 disabled:opacity-60"
          >
            {loading ? "Generating..." : subtasks.length ? "Regenerate" : "Generate"}
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm border border-gray-300 dark:border-gray-700"
            >
              Close
            </button>
            <button
              onClick={save}
              disabled={saving || subtasks.length === 0}
              className="px-4 py-2 rounded-lg text-sm bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save to task"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
