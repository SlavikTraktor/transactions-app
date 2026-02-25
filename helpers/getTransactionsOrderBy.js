const orderByMapping = {
  timestamp: "timestamp",
  sender: "sender",
  currency: "currency",
  source_type: "source_type",
};

const getTransactionsOrderBy = (orderByRaw) => {
  if (orderByMapping[orderByRaw] && orderByMapping[orderByRaw] !== "timestamp") {
    return `${orderByMapping[orderByRaw]}`;
  }
  return "timestamp";
};


module.exports = {
  getTransactionsOrderBy,
};