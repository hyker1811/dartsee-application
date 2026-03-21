import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { eq } from "drizzle-orm";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const sqlite3db = new Database(path.join(__dirname, "data", "db.sqlite3"));
const db = drizzle({
  client: sqlite3db,
});

/**
 * create table games
(
    id integer primary key,
    type text
);

create table players
(
    id text not null primary key,
    name text
);

create table game_players
(
    game_id integer not null,
    player_id text,
    id text not null primary key
);

create table throws
(
    id integer primary key,
    game_id integer,
    player_id text,
    score integer,
    modifier integer,
    x integer,
    y integer
);

 */

const gamesTable = sqliteTable("games", {
  id: integer("id").primaryKey(),
  type: text("type"),
});

const playersTable = sqliteTable("players", {
  id: text("id").primaryKey().notNull(),
  name: text("name"),
});

const gamePlayersTable = sqliteTable("game_players", {
  game_id: integer("game_id").notNull(),
  player_id: text("player_id"),
  id: text("id").primaryKey().notNull(),
});

const throwsTable = sqliteTable("throws", {
  id: integer("id").primaryKey(),
  game_id: integer("game_id"),
  player_id: text("player_id"),
  score: integer("score"),
  modifier: integer("modifier"),
  x: integer("x"),
  y: integer("y"),
});

// const result = await db.select().from(gamesTable).limit(10);

// console.log("Database connection test result:", result);
// console.log("Database connection test result type:", typeof result);

// const games = await db.select().from(gamesTable);
// const result = [];
// for (const game of games) {
//   const players = await db
//     .select()
//     .from(gamePlayersTable)
//     .where(eq(gamePlayersTable.game_id, game.id))
//     .innerJoin(playersTable, eq(gamePlayersTable.player_id, playersTable.id));

//   result.push({
//     id: game.id,
//     type: game.type,
//     players: players.map((p) => p.players.name),
//   });
// }
// console.log("Games with players:", JSON.stringify(result, null, 2));

// run the server
const app = express();
app.use(express.static(path.join(__dirname, "frontend", "build")));

app.get("/api/test", (req: express.Request, res: express.Response) => {
  res.json({ message: "Test endpoint is working!" });
});

app.get(
  "/api/games-list",
  async (req: express.Request, res: express.Response) => {
    const games = await db.select().from(gamesTable);
    const result = [];
    for (const game of games) {
      const players = await db
        .select()
        .from(gamePlayersTable)
        .where(eq(gamePlayersTable.game_id, game.id))
        .innerJoin(
          playersTable,
          eq(gamePlayersTable.player_id, playersTable.id),
        );

      result.push({
        id: game.id,
        type: game.type,
        players: players.map((p) => p.players.name),
      });
    }

    res.json(JSON.stringify(result));
  },
);

app.get("*path", (req: express.Request, res: express.Response) => {
  res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
