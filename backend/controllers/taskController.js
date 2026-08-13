const Task = require("../models/Task");

exports.createTask = async (req, res, next) => {
  try {
    const { title, description, priority, category, dueDate } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const task = await Task.create({
      user: req.userId,
      title,
      description,
      priority,
      category,
      dueDate: dueDate || null,
    });

    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

exports.getTasks = async (req, res, next) => {
  try {
    const { search, status, priority, category, sortBy, order } = req.query;
    const query = { user: req.userId };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    const sortField = sortBy || "createdAt";
    const sortOrder = order === "asc" ? 1 : -1;

    const tasks = await Task.find(query).sort({ [sortField]: sortOrder });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

exports.getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.userId });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    next(err);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const updates = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      updates,
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    next(err);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted", id: req.params.id });
  } catch (err) {
    next(err);
  }
};

exports.toggleStatus = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.userId });
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.status = task.status === "Completed" ? "Pending" : "Completed";
    await task.save();
    res.json(task);
  } catch (err) {
    next(err);
  }
};

exports.getStats = async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.userId });

    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "Completed").length;
    const pending = total - completed;

    const now = new Date();
    const overdue = tasks.filter(
      (t) => t.status === "Pending" && t.dueDate && new Date(t.dueDate) < now
    ).length;

    const byPriority = { Low: 0, Medium: 0, High: 0 };
    tasks.forEach((t) => {
      byPriority[t.priority] = (byPriority[t.priority] || 0) + 1;
    });

    const byCategory = {};
    tasks.forEach((t) => {
      byCategory[t.category] = (byCategory[t.category] || 0) + 1;
    });

    res.json({
      total,
      completed,
      pending,
      overdue,
      completionRate: total ? Math.round((completed / total) * 100) : 0,
      byPriority,
      byCategory,
    });
  } catch (err) {
    next(err);
  }
};
