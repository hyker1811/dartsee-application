import { useQuery } from "@tanstack/react-query";
import "./GamesListView.css";

function GamesListView() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["test"],
    queryFn: async () => {
      const response = await fetch("/api/test");
      if (!response.ok) {
        throw new Error("Failed to fetch test data");
      }
      return response.json();
    },
  });

  if (isLoading)
    return <section className="games-list-view">Loading...</section>;
  if (error)
    return (
      <section className="games-list-view">Error: {error.message}</section>
    );

  return (
    <section className="games-list-view">
      <p>{data?.message}</p>
    </section>
  );
}

export default GamesListView;
