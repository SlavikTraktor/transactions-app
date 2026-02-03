const express = require("express");
const { Logger } = require("../services/logger");
const { lastDayOfMonth } = require("date-fns");
const { CurrenciesRange } = require("../services/currenciesRange");
const { CurrencyDate } = require("../services/currencyDate");
const router = express.Router();

router.get("/currenciesrate", (req, res) => {
  const today = new Date();
  const monthStartDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const monthEndDate = lastDayOfMonth(monthStartDate);
  req.query.startDate = req.query.startDate || monthStartDate.toISOString();
  req.query.endDate = req.query.endDate || monthEndDate.toISOString();
  req.query.ccy = req.query.ccy || "USD";
  CurrenciesRange.fetch(req.query.startDate, req.query.endDate, req.query.ccy)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      Logger.error(`Ошибка при получении курса валют: ${error.toString()}`);
      res.status(500).json({ error: "Не удалось получить курс валют" });
    });
});

router.get("/currencyrate", (req, res) => {
  if (!req.query.date) {
    res.status(400).json({ error: "Параметр date обязателен" });
    return;
  }
  req.query.ccy = req.query.ccy || "USD";
  CurrencyDate.fetch(req.query.date, req.query.ccy)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      Logger.error(`Ошибка при получении курса валют на дату: ${error.toString()}`);
      res.status(500).json({ error: "Не удалось получить курс валют на дату" });
    });
});

module.exports = router;
