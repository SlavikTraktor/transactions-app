const { currenciesRateRangeURL } = require("../constants");

class _CurrenciesRange {
  MAX_CACHE_SIZE = 15;
  MAX_CACHE_DAYS = 40;

  constructor() {
    this.cache = new Map();
    this.cacheCounter = 1;
  }

  getCacheKey(startDate, endDate, ccy) {
    return `${startDate} ${endDate} ${ccy}`;
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

  async fetch(startDate, endDate, ccy) {
    const cacheKey = this.getCacheKey(startDate, endDate, ccy);
    const cacheValue = this.getCacheValue(cacheKey);
    if (cacheValue) {
      console.log("Cache");
      return cacheValue;
    }

    const url = currenciesRateRangeURL
      .replace("{startDate}", startDate)
      .replace("{endDate}", endDate)
      .replace("{ccy}", ccy);

    console.log("Request");

    const currenciesRange = await fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .catch((error) => {
        throw error;
      });

    if (currenciesRange.length <= this.MAX_CACHE_DAYS) {
      this.setCacheValue(cacheKey, currenciesRange);
    }

    return currenciesRange;
  }
}

const CurrenciesRange = new _CurrenciesRange();

module.exports = {
  CurrenciesRange,
};
