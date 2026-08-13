const Task = require("../models/Task");
const cohereClient = require("../utils/cohere");

// Break a single task down into actionable subtasks
exports.suggestSubtasks = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ message: "Task title is required" });

    const systemPrompt =
      "You are a productivity assistant inside a task management app. " +
      "Given a task title and optional description, break it down into 3 to 6 short, " +
      "concrete, actionable subtasks. Respond ONLY with a numbered plain-text list, " +
      "no preamble, no explanations, no markdown formatting.";

    const userMessage = `Task title: ${title}\nDescription: ${description || "N/A"}`;

    const raw = await cohereClient.chat(userMessage, systemPrompt);

    const subtasks = raw
      .split("\n")
      .map((line) => line.replace(/^\s*\d+[\.\)]\s*/, "").trim())
      .filter(Boolean);

    res.json({ subtasks });
  } catch (err) {
    next(err);
  }
};

// Save AI-generated subtasks onto a task document
exports.saveSubtasks = async (req, res, next) => {
  try {
    const { subtasks } = req.body;
    const task = await Task.findOne({ _id: req.params.id, user: req.userId });
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.aiSubtasks = Array.isArray(subtasks) ? subtasks : [];
    await task.save();
    res.json(task);
  } catch (err) {
    next(err);
  }
};

// Summarize the user's current workload
exports.getDailySummary = async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.userId, status: "Pending" }).sort({ dueDate: 1 });

    if (tasks.length === 0) {
      return res.json({ summary: "You have no pending tasks. You're all caught up!" });
    }

    const taskList = tasks
      .slice(0, 25)
      .map(
        (t, i) =>
          `${i + 1}. ${t.title} | priority: ${t.priority} | category: ${t.category} | due: ${
            t.dueDate ? new Date(t.dueDate).toDateString() : "no due date"
          }`
      )
      .join("\n");

    const systemPrompt =
      "You are a productivity assistant inside a task management app. " +
      "Given a user's list of pending tasks, write a short, friendly, motivating summary " +
      "(4-6 sentences) that highlights urgent or high-priority items, groups related work, " +
      "and suggests a sensible order to tackle things today. Do not use markdown formatting.";

    const summary = await cohereClient.chat(taskList, systemPrompt);
    res.json({ summary });
  } catch (err) {
    next(err);
  }
};

// Suggest a priority and category for a new task based on its text
exports.classifyTask = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ message: "Task title is required" });

    const systemPrompt =
      "You are a task classification assistant. Given a task title and description, " +
      "respond ONLY with a strict JSON object of the form " +
      '{"priority": "Low|Medium|High", "category": "short category name"}. ' +
      "No explanation, no markdown, just the JSON object.";

    const userMessage = `Task title: ${title}\nDescription: ${description || "N/A"}`;
    const raw = await cohereClient.chat(userMessage, systemPrompt);

    let parsed;
    try {
      const cleaned = raw.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = { priority: "Medium", category: "General" };
    }

    res.json(parsed);
  } catch (err) {
    next(err);
  }
};
