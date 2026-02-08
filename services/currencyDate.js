const { default: axios } = require("axios");
const { currenciesRateSingleURL } = require("../constants");

class _CurrencyDate {
  MAX_CACHE_SIZE = 50;

  constructor() {
    this.cache = new Map();
    this.cacheCounter = 1;
  }

  getCacheKey(date, ccy) {
    return `${date} ${ccy}`;
  }

  setCacheValue(key, value) {
    if (this.cache.size === this.MAX_CACHE_SIZE) {
      this.removeOldestCache();
    }
    this.cache.set(`${this.cacheCounter++} ${key}`, value);
  }

  getCacheValue(key) {
    const rawKey = [...this.cache.keys()].find((v) => v.endsWith(key));
    return rawKey ? this.cache.get(rawKey) : undefined;
  }

  removeOldestCache() {
    const oldestKey = [...this.cache.keys()].reduce((acc, v) => {
      if (+acc.split(" ")[0] < +v.split(" ")[0]) {
        return v;
      }

      return acc;
    });

    this.cache.delete(oldestKey);
  }

  async fetch(date, ccy) {
    const cacheKey = this.getCacheKey(date, ccy);
    const cacheValue = this.getCacheValue(cacheKey);
    if (cacheValue) {
      console.log("Cache 1");
      return cacheValue;
    }

    const url = currenciesRateSingleURL.replace("{date}", date).replace("{ccy}", ccy);
      console.log("Request 1");

    const currencyDate = await axios
      .get(url)
      .then((response) => response.data)
      .catch((error) => {
        throw error;
      });

    this.setCacheValue(cacheKey, currencyDate);

    return currencyDate;
  }
}

const CurrencyDate = new _CurrencyDate();

module.exports = {
  CurrencyDate,
};
