const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  suggestSubtasks,
  saveSubtasks,
  getDailySummary,
  classifyTask,
} = require("../controllers/aiController");

router.use(auth);

router.post("/suggest-subtasks", suggestSubtasks);
router.patch("/tasks/:id/subtasks", saveSubtasks);
router.get("/daily-summary", getDailySummary);
router.post("/classify", classifyTask);

module.exports = router;
