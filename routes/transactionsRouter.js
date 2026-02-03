const express = require("express");
const { DB } = require("../services/db");
const router = express.Router();

// Этот эндпоинт будет доступен по пути /api/data/save
router.get("/transactions", (req, res) => {
  const sources = req.query.sources;
  const currencies = req.query.currencies;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  let sql = "SELECT * FROM transactions";
  const params = [];
  if (sources && sources.length > 0) {
    const sourcesArray = sources.split(",");
    const sqlPlaceholder = sourcesArray.map(() => "?").join(",");
    sql += " WHERE source_type IN (" + sqlPlaceholder + ")";
    params.push(...sourcesArray);
  }
  if (currencies && currencies.length > 0) {
    const currenciesArray = currencies.split(",");
    const sqlPlaceholder = currenciesArray.map(() => "?").join(",");
    sql +=
      params.length > 0 ? " AND currency IN (" + sqlPlaceholder + ")" : " WHERE currency IN (" + sqlPlaceholder + ")";
    params.push(...currenciesArray);
  }
  if (startDate) {
    sql += params.length > 0 ? " AND timestamp >= ?" : " WHERE timestamp >= ?";
    params.push(startDate);
  }
  if (endDate) {
    sql += params.length > 0 ? " AND timestamp <= ?" : " WHERE timestamp <= ?";
    params.push(endDate);
  }

  sql += " ORDER BY timestamp DESC";

  const rows = DB.prepare(sql).all(...params);

  res.json(rows);
});

router.post("/transactions", (req, res) => {
  // uuid timestamp amount description sender currency source_type
  const { data } = req.body;
  const prepareDB = DB.prepare(
    "INSERT OR IGNORE INTO transactions (uuid, timestamp, amount, description, sender, currency, source_type) VALUES (?, ?, ?, ?, ?, ?, ?)",
  );
  const transactionsValues = data.map((t) => [
    t.uuid,
    t.timestamp.replace("T", " ").replace("Z", ""),
    t.amount,
    t.description,
    t.sender,
    t.currency,
    t.source_type,
  ]);
  DB.insertMany(prepareDB, transactionsValues);
  res.json({ success: true });
});

module.exports = router;
