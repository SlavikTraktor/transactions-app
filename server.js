const express = require("express");
const path = require("path");
const { exeDir, isBundle } = require("./constants");
const { Logger } = require("./services/logger");
const { DB, migrate } = require("./services/db");
const { extractBinary } = require("./helpers/extractBinary");
const { Systray } = require("./services/systray");

if (isBundle) {
  extractBinary(exeDir);
}

migrate(DB);

try {
  // --- СЕРВЕР ---
  const app = express();
  app.use(express.json());

  // Раздача фронтенда (папка dist должна быть внутри ресурсов nexe)
  const distPath = path.join(__dirname, "frontend/dist");
  app.use(express.static(distPath));

  // API Эндпоинты
  app.get("/api/settings", (req, res) => {
    const rows = DB.prepare("SELECT * FROM settings").all();
    res.json(rows);
  });

  app.post("/api/settings", (req, res) => {
    const { key, value } = req.body;
    DB.run("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", [key, value]);
    res.json({ success: true });
  });

  // SPA роутинг: всё остальное в index.html
  app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });

  const server = app.listen(3000, async () => {
    console.log("Сервер запущен на http://localhost:3000");
    Logger.log("Сервер запущен на http://localhost:3000");
    //   openBrowser("http://localhost:3000");
  });
} catch (error) {
  Logger.error(error.toString());
}

new Systray(DB).init();
