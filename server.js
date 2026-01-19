const express = require("express");
const path = require("path");
const cors = require("cors");
const { exeDir, isBundle, port } = require("./constants");
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
  app.use(cors());

  // Раздача фронтенда (папка dist должна быть внутри ресурсов nexe)
  const distPath = path.join(__dirname, "frontend/dist");
  app.use(express.static(distPath));

  // API Эндпоинты
  app.get("/api/transactions", (req, res) => {
    const rows = DB.prepare("SELECT * FROM transactions").all();
    res.json(rows);
  });

  app.post("/api/transactions", (req, res) => {
    // uuid timestamp amount description sender currency source_type
    const { data } = req.body;
    const prepareDB = DB.prepare(
      "INSERT OR REPLACE INTO transactions (uuid, timestamp, amount, description, sender, currency, source_type) VALUES (?, ?, ?, ?, ?, ?, ?)",
    );
    const transactionsValues = data.map((t) => [t.uuid, t.timestamp, t.amount, t.description, t.sender, t.currency, t.source_type]);
    DB.insertMany(prepareDB, transactionsValues);
    res.json({ success: true });
  });

  // SPA роутинг: всё остальное в index.html
  app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });

  const server = app.listen(port, async () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
    Logger.log(`Сервер запущен на http://localhost:${port}`);
    //   openBrowser("http://localhost:3000");
  });
} catch (error) {
  Logger.error(error.toString());
}

new Systray(DB).init();
