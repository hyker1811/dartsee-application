import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const sqlite3db = new Database(path.join(__dirname, "data", "db.sqlite3"));
const db = drizzle({
  client: sqlite3db,
});

const playersTable = sqliteTable("players", {
  id: integer("id").primaryKey(),
  name: text("name"),
});

// run the server
const app = express();
app.use(express.static(path.join(__dirname, "frontend", "build")));

app.get("/api/test", (req: express.Request, res: express.Response) => {
  res.json({ message: "Test endpoint is working!" });
});

app.get("/", (req: express.Request, res: express.Response) => {
  res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
