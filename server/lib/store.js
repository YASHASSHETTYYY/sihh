import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.resolve(process.cwd(), "server", "data");
const DATA_FILE = path.join(DATA_DIR, "db.json");

const defaultDb = () => ({
  users: [],
  moods: [],
  chats: [],
});

async function ensureDataFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify(defaultDb(), null, 2), "utf8");
  }
}

async function readDb() {
  await ensureDataFile();
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      moods: Array.isArray(parsed.moods) ? parsed.moods : [],
      chats: Array.isArray(parsed.chats) ? parsed.chats : [],
    };
  } catch {
    const fresh = defaultDb();
    await fs.writeFile(DATA_FILE, JSON.stringify(fresh, null, 2), "utf8");
    return fresh;
  }
}

async function writeDb(db) {
  await ensureDataFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(db, null, 2), "utf8");
}

export async function getUserByEmail(email) {
  const db = await readDb();
  return db.users.find(
    (user) => user.email.toLowerCase() === String(email).toLowerCase()
  );
}

export async function getUserById(userId) {
  const db = await readDb();
  return db.users.find((user) => user.id === userId);
}

export async function createUser(user) {
  const db = await readDb();
  db.users.push(user);
  await writeDb(db);
  return user;
}

export async function createMoodEntry(entry) {
  const db = await readDb();
  db.moods.push(entry);
  await writeDb(db);
  return entry;
}

export async function listMoodsByUser(userId) {
  const db = await readDb();
  return db.moods
    .filter((entry) => entry.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function addChatMessage(message) {
  const db = await readDb();
  db.chats.push(message);
  await writeDb(db);
  return message;
}

