const express = require("express");
const path = require("path");
const cors = require("cors");
const { lastDayOfMonth } = require("date-fns");
const { exeDir, isBundle, port, currenciesRateRangeURL, currenciesRateSingleURL } = require("./constants");
const { Logger } = require("./services/logger");
const { DB, migrate } = require("./services/db");
const { extractBinary } = require("./helpers/extractBinary");
const { Systray } = require("./services/systray");
const { default: axios } = require("axios");

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

  app.get("/api/currenciesrate", (req, res) => {
    const today = new Date();
    const monthStartDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const monthEndDate = lastDayOfMonth(monthStartDate);
    req.query.startDate = req.query.startDate || monthStartDate.toISOString();
    req.query.endDate = req.query.endDate || monthEndDate.toISOString();
    req.query.ccy = req.query.ccy || "USD";
    const url = currenciesRateRangeURL.replace("{startDate}", req.query.startDate).replace("{endDate}", req.query.endDate).replace("{ccy}", req.query.ccy);
    axios.get(url).then((response) => {
      res.json(response.data);
    }).catch((error) => {
      Logger.error(`Ошибка при получении курса валют: ${error.toString()}`);
      res.status(500).json({ error: "Не удалось получить курс валют" });
    });
  });

  app.get("/api/currencyrate", (req, res) => {
    if(!req.query.date){
      res.status(400).json({ error: "Параметр date обязателен" });
      return;
    }
    req.query.ccy = req.query.ccy || "USD";
    const url = currenciesRateSingleURL.replace("{date}", req.query.date).replace("{ccy}", req.query.ccy);
    axios.get(url).then((response) => {
      res.json(response.data);
    }).catch((error) => {
      Logger.error(`Ошибка при получении курса валют: ${error.toString()}`);
      res.status(500).json({ error: "Не удалось получить курс валют" });
    });
  });

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
    const transactionsValues = data.map((t) => [t.uuid, t.timestamp.replace('T', ' '), t.amount, t.description, t.sender, t.currency, t.source_type]);
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
