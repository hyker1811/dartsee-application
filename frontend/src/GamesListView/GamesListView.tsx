import { useQuery } from "@tanstack/react-query";
import h337 from "heatmap.js";
import { useEffect, useMemo, useRef, useState } from "react";
import "./GamesListView.css";

interface Game {
  id: number;
  type: string;
}

interface GameDetail {
  id: number;
  type: string;
  throws: Array<{
    id: number;
    playerId: string | null;
    score: number | null;
    modifier: number | null;
    x: number | null;
    y: number | null;
  }>;
  players: Array<{
    id: string;
    name: string;
    averageScore: number;
    missCount: number;
  }>;
}

const DARTBOARD_SEGMENT_NUMBERS = [
  20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5,
];

function ThrowHeatmap({
  throws,
}: {
  throws: Array<{ x: number | null; y: number | null }>;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const points = useMemo(() => {
    const throwsWithCoordinates = throws.filter(
      (throwData) =>
        typeof throwData.x === "number" && typeof throwData.y === "number",
    );

    if (throwsWithCoordinates.length === 0) {
      return [];
    }

    const canvasSize = 800;
    const clampCoordinate = (coordinate: number) =>
      Math.max(0, Math.min(canvasSize, Math.round(coordinate)));

    return throwsWithCoordinates.map((throwData) => ({
      x: clampCoordinate(throwData.x as number),
      y: clampCoordinate(throwData.y as number),
      value: 1,
    }));
  }, [throws]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || points.length === 0) {
      return;
    }

    const heatmapInstance = h337.create({
      container,
      radius: 22,
      maxOpacity: 0.8,
      minOpacity: 0.15,
      blur: 0.85,
    });

    heatmapInstance.setData({
      min: 0,
      max: Math.max(...points.map((point) => point.value), 1),
      data: points,
    });

    return () => {
      container.innerHTML = "";
    };
  }, [points]);

  if (points.length === 0) {
    return <p className="game-detail-empty">No throw coordinates available</p>;
  }

  return (
    <div className="game-heatmap-wrapper">
      <div
        ref={containerRef}
        className="game-heatmap"
        aria-label="Throw heatmap"
      >
        <div className="game-heatmap-numbers" aria-hidden="true">
          {DARTBOARD_SEGMENT_NUMBERS.map((segmentNumber, index) => {
            const angleInRadians = ((-90 + index * 18) * Math.PI) / 180;
            const labelRadius = 340;
            const x = 400 + Math.cos(angleInRadians) * labelRadius;
            const y = 400 + Math.sin(angleInRadians) * labelRadius;

            return (
              <span
                key={segmentNumber}
                className="game-heatmap-number"
                style={{ left: `${x}px`, top: `${y}px` }}
              >
                {segmentNumber}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
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
      <div className="game-detail-section">
        <h4>Throws Heatmap</h4>
        <ThrowHeatmap throws={data.throws} />
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
