import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PieChart } from "react-minimal-pie-chart";
import "./GamePopularityStatisticsView.css";

// 20 colors should be enough for everyone
const COLORS = [
  "orange",
  "red",
  "purple",
  "blue",
  "green",
  "violet",
  "cyan",
  "magenta",
  "yellow",
  "brown",
  "gray",
  "black",
  "pink",
  "teal",
  "navy",
  "maroon",
  "olive",
  "lime",
  "aqua",
  "silver",
];

interface GamePopularityStat {
  count: number;
  type: string;
}

function GamePopularityStatisticsView() {
  const { data, isLoading, error } = useQuery<GamePopularityStat[]>({
    queryKey: ["game-popularity-statistics"],
    queryFn: async () => {
      const response = await fetch("/api/game-popularity-statistics");
      if (!response.ok) throw new Error("Failed to fetch statistics");
      return response.json();
    },
  });

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (isLoading)
    return (
      <section className="game-popularity-statistics-view">Loading...</section>
    );
  if (error)
    return (
      <section className="game-popularity-statistics-view">
        Error loading statistics.
      </section>
    );

  const chartData = (data ?? []).map((stat, index) => ({
    title: stat.type,
    value: stat.count,
    color: COLORS[index % COLORS.length],
  }));

  return (
    <section className="game-popularity-statistics-view">
      <h2 className="game-popularity-statistics-view-title">
        Game Popularity Statistics
      </h2>
      <p className="game-popularity-statistics-view-description">
        Number of games played per game type.
      </p>
      <div className="game-popularity-chart-container">
        <PieChart
          data={chartData}
          animate
          style={{ maxWidth: "300px", maxHeight: "400px" }}
          segmentsShift={(index) => (index === hoveredIndex ? 5 : 0)}
          onMouseOver={(_, index) => setHoveredIndex(index)}
          onMouseOut={() => setHoveredIndex(null)}
        />
        <ul className="game-popularity-legend">
          {chartData.map((entry, index) => (
            <li
              key={entry.title}
              className={`game-popularity-legend-item${
                index === hoveredIndex
                  ? " game-popularity-legend-item--active"
                  : ""
              }`}
              onMouseOver={() => setHoveredIndex(index)}
              onMouseOut={() => setHoveredIndex(null)}
            >
              <span
                className="game-popularity-legend-color"
                style={{ backgroundColor: entry.color }}
              />
              {entry.title} ({entry.value})
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default GamePopularityStatisticsView;
