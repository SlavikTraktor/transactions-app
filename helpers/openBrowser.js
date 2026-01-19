const { exec } = require("child_process");

function openBrowser(url) {
  const start = process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open";
  exec(`${start} ${url}`);
}

module.exports = { openBrowser };