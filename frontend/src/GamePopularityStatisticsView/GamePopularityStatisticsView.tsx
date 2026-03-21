import { useQuery } from "@tanstack/react-query";
import { PieChart } from "react-minimal-pie-chart";
import "./GamePopularityStatisticsView.css";

const COLORS = ["orange", "red", "purple", "blue", "green", "violet"];

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
      <PieChart
        data={chartData}
        label={({ dataEntry }) => `${dataEntry.title} (${dataEntry.value})`}
        labelStyle={{ fontSize: "5px", fill: "#fff" }}
        labelPosition={70}
        animate
        style={{ maxWidth: "600px" }}
      />
    </section>
  );
}

export default GamePopularityStatisticsView;
