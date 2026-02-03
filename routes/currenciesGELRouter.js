const express = require("express");
const { Logger } = require("../services/logger");
const { lastDayOfMonth } = require("date-fns");
const { currenciesRateRangeURL, currenciesRateSingleURL } = require("../constants");
const { default: axios } = require("axios");
const router = express.Router();

router.get("/currenciesrate", (req, res) => {
  const today = new Date();
  const monthStartDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const monthEndDate = lastDayOfMonth(monthStartDate);
  req.query.startDate = req.query.startDate || monthStartDate.toISOString();
  req.query.endDate = req.query.endDate || monthEndDate.toISOString();
  req.query.ccy = req.query.ccy || "USD";
  const url = currenciesRateRangeURL
    .replace("{startDate}", req.query.startDate)
    .replace("{endDate}", req.query.endDate)
    .replace("{ccy}", req.query.ccy);
  axios
    .get(url)
    .then((response) => {
      res.json(response.data);
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
  const url = currenciesRateSingleURL.replace("{date}", req.query.date).replace("{ccy}", req.query.ccy);
  axios
    .get(url)
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      Logger.error(`Ошибка при получении курса валют: ${error.toString()}`);
      res.status(500).json({ error: "Не удалось получить курс валют" });
    });
});

module.exports = router;
