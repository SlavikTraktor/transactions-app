const path = require("path");

const isBundle = typeof process.pkg !== "undefined";
const exeDir = isBundle ? path.dirname(process.execPath) : __dirname;

// assets to be extracted when running in bundled mode
const externalSQliteBinaryPath = path.join(exeDir, "better_sqlite3.node");
const internalSQliteBinary = path.join(__dirname, "node_modules/better-sqlite3/build/Release/better_sqlite3.node");
const externalTrayPath = path.join(exeDir, "tray_windows_helper.exe");
const internalTrayPath = path.join(__dirname, "node_modules/systray2/traybin/tray_windows_release.exe");

// database path
const dbPath = path.join(exeDir, "db", "data.db");

// logfile path
const logfile = path.join(exeDir, "log.txt");

const iconPath = path.join(__dirname, "assets", "icon.ico");

const frontendURL = "http://localhost:3000";

module.exports = {
  isBundle,
  exeDir,
  logfile,
  externalSQliteBinaryPath,
  internalSQliteBinary,
  dbPath,
  externalTrayPath,
  internalTrayPath,
  frontendURL,
  iconPath,
};
