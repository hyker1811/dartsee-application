import sqlite3 from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDirname = path.dirname(fileURLToPath(import.meta.url));

if (fs.existsSync(path.join(currentDirname, "db.sqlite3"))) {
  console.log("Removing existing database...");
  fs.rmSync(path.join(currentDirname, "db.sqlite3"));
}

const db = new sqlite3(path.join(currentDirname, "db.sqlite3"));

console.log("Executing schema.sql...");
db.exec(fs.readFileSync(path.join(currentDirname, "schema.sql"), "utf-8"));

console.log("Executing data.sql. This might take a while...");
db.exec(fs.readFileSync(path.join(currentDirname, "data.sql"), "utf-8"));

console.log("Database initialization complete.");
