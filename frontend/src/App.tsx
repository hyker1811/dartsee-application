import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  NavLink,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import "./App.css";
import GameDetailView from "./GameDetailView/GameDetailView";
import GamePopularityStatisticsView from "./GamePopularityStatisticsView/GamePopularityStatisticsView";
import GamesListView from "./GamesListView/GamesListView";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="App">
          <header className="app-header">
            <nav className="tab-nav" aria-label="Application views">
              <NavLink
                to="/games-list"
                className={({ isActive }) =>
                  isActive ? "tab-link active" : "tab-link"
                }
              >
                Games list view
              </NavLink>
              <NavLink
                to="/game-detail"
                className={({ isActive }) =>
                  isActive ? "tab-link active" : "tab-link"
                }
              >
                Game detail view
              </NavLink>
              <NavLink
                to="/game-popularity-statistics"
                className={({ isActive }) =>
                  isActive ? "tab-link active" : "tab-link"
                }
              >
                Game popularity statistics view
              </NavLink>
            </nav>
          </header>

          <main className="app-main">
            <Routes>
              <Route path="/" element={<Navigate to="/games-list" replace />} />
              <Route path="/games-list" element={<GamesListView />} />
              <Route path="/game-detail" element={<GameDetailView />} />
              <Route
                path="/game-popularity-statistics"
                element={<GamePopularityStatisticsView />}
              />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
