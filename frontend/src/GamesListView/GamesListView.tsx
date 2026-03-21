import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import "./GamesListView.css";

interface Game {
  id: number;
  type: string;
}

interface GameDetail {
  id: number;
  type: string;
  players: Array<{
    id: string;
    name: string;
    averageScore: number;
    missCount: number;
  }>;
}

function GameDetailPanel({ gameId }: { gameId: number }) {
  const { data, isLoading, error } = useQuery<GameDetail>({
    queryKey: ["gameDetail", gameId],
    queryFn: async () => {
      const response = await fetch(`/api/games-detail/${gameId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch game details");
      }
      return response.json();
    },
  });

  if (isLoading)
    return <div className="game-detail-panel">Loading details...</div>;
  if (error)
    return <div className="game-detail-panel">Error: {error.message}</div>;
  if (!data) return null;

  return (
    <div className="game-detail-panel">
      <div className="game-detail-section">
        <h4>Players</h4>
        {data.players.length === 0 ? (
          <p className="game-detail-empty">No players recorded</p>
        ) : (
          <ul className="game-detail-players">
            {data.players.map((player) => (
              <li key={player.id}>
                {player.name ?? player.id} - Average Score per round:{" "}
                {player.averageScore.toFixed(3)} - Misses: {player.missCount}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function GamesListView() {
  const [expandedGameIds, setExpandedGameIds] = useState<Set<number>>(
    new Set(),
  );

  const { data, isLoading, error } = useQuery<Game[]>({
    queryKey: ["gamesList"],
    queryFn: async () => {
      const response = await fetch("/api/games-list");
      if (!response.ok) {
        throw new Error("Failed to fetch games list");
      }
      return response.json();
    },
  });

  const toggleGame = (gameId: number) => {
    setExpandedGameIds((prev) => {
      const next = new Set(prev);
      if (next.has(gameId)) {
        next.delete(gameId);
      } else {
        next.add(gameId);
      }
      return next;
    });
  };

  if (isLoading)
    return <section className="games-list-view">Loading...</section>;
  if (error)
    return (
      <section className="games-list-view">Error: {error.message}</section>
    );

  return (
    <section className="games-list-view">
      <div className="games-list">
        {data?.map((game) => (
          <div key={game.id} className="game-row-container">
            <button
              className={`game-row ${expandedGameIds.has(game.id) ? "game-row-expanded" : ""}`}
              onClick={() => toggleGame(game.id)}
            >
              <span className="game-row-id">#{game.id}</span>
              <span className="game-row-type">{game.type}</span>
              <span className="game-row-chevron">
                {expandedGameIds.has(game.id) ? "▼" : "▶"}
              </span>
            </button>
            {expandedGameIds.has(game.id) && (
              <GameDetailPanel gameId={game.id} />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default GamesListView;
