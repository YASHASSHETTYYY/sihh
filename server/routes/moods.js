import { Router } from "express";
import { randomUUID } from "crypto";
import { authRequired } from "../lib/auth.js";
import { createMoodEntry, listMoodsByUser } from "../lib/store.js";

const router = Router();

function calcCurrentStreak(moods) {
  const days = new Set(
    moods.map((entry) => new Date(entry.createdAt).toISOString().slice(0, 10))
  );

  let streak = 0;
  const cursor = new Date();

  while (true) {
    const key = cursor.toISOString().slice(0, 10);
    if (!days.has(key)) {
      break;
    }
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

router.get("/", authRequired, async (req, res) => {
  const moods = await listMoodsByUser(req.userId);
  return res.json({ moods });
});

router.post("/", authRequired, async (req, res) => {
  const { mood, note = "" } = req.body || {};
  const moodValue = Number(mood);

  if (!Number.isInteger(moodValue) || moodValue < 1 || moodValue > 5) {
    return res.status(400).json({ message: "Mood must be an integer from 1 to 5" });
  }

  const entry = {
    id: randomUUID(),
    userId: req.userId,
    mood: moodValue,
    note: String(note).trim(),
    createdAt: new Date().toISOString(),
  };

  await createMoodEntry(entry);
  return res.status(201).json({ mood: entry });
});

router.get("/stats", authRequired, async (req, res) => {
  const moods = await listMoodsByUser(req.userId);

  if (!moods.length) {
    return res.json({
      totalEntries: 0,
      averageMood: 0,
      currentStreak: 0,
      latestMood: null,
      weeklyAverage: 0,
    });
  }

  const total = moods.length;
  const averageMood =
    Math.round(
      (moods.reduce((sum, entry) => sum + Number(entry.mood || 0), 0) / total) * 100
    ) / 100;

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const weekly = moods.filter((entry) => new Date(entry.createdAt) >= sevenDaysAgo);
  const weeklyAverage = weekly.length
    ? Math.round(
        (weekly.reduce((sum, entry) => sum + Number(entry.mood || 0), 0) /
          weekly.length) *
          100
      ) / 100
    : 0;

  return res.json({
    totalEntries: total,
    averageMood,
    currentStreak: calcCurrentStreak(moods),
    latestMood: moods[0],
    weeklyAverage,
  });
});

export default router;
