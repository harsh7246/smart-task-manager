import { useState } from "react";
import api from "../api/axios.js";

export default function AISummaryPanel() {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchSummary() {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/ai/daily-summary");
      setSummary(data.summary);
    } catch (err) {
      setError(err.response?.data?.message || "Could not generate summary right now");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl p-4 mb-6 bg-primary-50 dark:bg-gray-900 border border-primary-100 dark:border-gray-800">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-sm">✨ AI Daily Summary</h3>
        <button
          onClick={fetchSummary}
          disabled={loading}
          className="text-xs px-3 py-1 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-60"
        >
          {loading ? "Thinking..." : summary ? "Regenerate" : "Generate"}
        </button>
      </div>
      {error && <p className="text-sm text-rose-600">{error}</p>}
      {summary && !error && (
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{summary}</p>
      )}
      {!summary && !error && !loading && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Get an AI-generated overview of today's pending work, powered by Cohere.
        </p>
      )}
    </div>
  );
}
