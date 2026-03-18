import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log("Hello, World!");

const app = express();

app.use(express.static(path.join(__dirname, "frontend", "build")));

app.get("/", (req: express.Request, res: express.Response) => {
  res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
