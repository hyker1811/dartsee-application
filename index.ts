import Database from "better-sqlite3";
import { count, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const sqlite3db = new Database(path.join(__dirname, "data", "db.sqlite3"));
const db = drizzle({
  client: sqlite3db,
});

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
    res.json(games);
  },
);

app.get(
  "/api/games-detail/:gameId",
  async (req: express.Request, res: express.Response) => {
    const gameId =
      typeof req.params.gameId === "string"
        ? parseInt(req.params.gameId)
        : null;
    if (gameId === null || isNaN(gameId)) {
      res.status(400).json({ error: "Invalid game ID" });
      return;
    }

    const game = (
      await db.select().from(gamesTable).where(eq(gamesTable.id, gameId))
    )[0];

    if (!game) {
      res.status(404).json({ error: "Game not found" });
      return;
    }

    const players = await db
      .select()
      .from(gamePlayersTable)
      .where(eq(gamePlayersTable.game_id, gameId))
      .innerJoin(playersTable, eq(gamePlayersTable.player_id, playersTable.id));

    const throws = await db
      .select()
      .from(throwsTable)
      .where(eq(throwsTable.game_id, gameId));

    res.json({
      id: game.id,
      type: game.type,
      throws: throws.map((throwData) => ({
        id: throwData.id,
        playerId: throwData.player_id,
        score: throwData.score,
        modifier: throwData.modifier,
        x: throwData.x,
        y: throwData.y,
      })),
      players: players.map((player) => {
        const playerThrows = throws.filter(
          (throwData) => throwData.player_id === player.players.id,
        );

        const playerRoundAverages: number[] = [];
        for (let i = 0; i < playerThrows.length; i += 3) {
          const roundThrows = playerThrows.slice(i, i + 3); // if we slice outside of bounds, it will just return the remaining items, so no need to check if there are 3 throws
          const roundAverage =
            roundThrows.reduce(
              (sum, throwData) =>
                sum + (throwData.score ?? 0) * (throwData.modifier ?? 0),
              0,
            ) / (roundThrows.length || 1);
          playerRoundAverages.push(roundAverage);
        }

        const missCount = playerThrows.filter(
          (throwData) =>
            throwData.modifier === 0 || throwData.modifier === null,
        ).length;

        const averageScore =
          playerRoundAverages.reduce(
            (sum, playerRoundAverage) => sum + playerRoundAverage,
            0,
          ) / (playerRoundAverages.length || 1);

        return {
          id: player.players.id,
          name: player.players.name,
          averageScore,
          missCount,
        };
      }),
    });
  },
);

app.get(
  "/api/game-popularity-statistics",
  async (req: express.Request, res: express.Response) => {
    const gamesCount = await db
      .select({ count: count(), type: gamesTable.type })
      .from(gamesTable)
      .groupBy(gamesTable.type);

    res.json(gamesCount);
  },
);

app.get("*path", (req: express.Request, res: express.Response) => {
  res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
