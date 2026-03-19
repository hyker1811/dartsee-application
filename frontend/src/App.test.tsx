import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders tab navigation", () => {
  render(<App />);

  expect(
    screen.getByRole("link", { name: /games list view/i }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: /game detail view/i }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: /game popularity statistics view/i }),
  ).toBeInTheDocument();
});
