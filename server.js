const express = require("express");
const path = require("path");
const fs = require("fs");
const Database = require("better-sqlite3");
const SysTray = require("systray2").default;
const { exec } = require("child_process");

const isBundle = typeof process.pkg !== "undefined";
const exeDir = isBundle ? path.dirname(process.execPath) : __dirname;
const logfile = path.join(exeDir, "log.txt");

if (fs.existsSync(path.join(exeDir, "db")) === false) {
  fs.mkdirSync(path.join(exeDir, "db"));
}
const dbPath = path.join(exeDir, "db", "data.db");

const binaryPaths = isBundle ? extractBinary(exeDir) : {};

const db = new Database(dbPath, {
  nativeBinding: binaryPaths.externalSQliteBinaryPath || undefined,
});
db.pragma("journal_mode = WAL"); // Ускоряет работу SQLite

// Создаем таблицу, если её нет
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  )
`,
).run();

try {
  // --- СЕРВЕР ---
  const app = express();
  app.use(express.json());

  // Раздача фронтенда (папка dist должна быть внутри ресурсов nexe)
  const distPath = path.join(__dirname, "frontend/dist");
  app.use(express.static(distPath));

  // API Эндпоинты
  app.get("/api/settings", (req, res) => {
    const rows = db.prepare("SELECT * FROM settings").all();
    res.json(rows);
  });

  app.post("/api/settings", (req, res) => {
    const { key, value } = req.body;
    db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)").run(key, value);
    res.json({ success: true });
  });

  // SPA роутинг: всё остальное в index.html
  app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });

  const server = app.listen(3000, async () => {
    console.log("Сервер запущен на http://localhost:3000");
    //   openBrowser("http://localhost:3000");
  });
  fs.writeFileSync(logfile, "success: ");
} catch (error) {
  fs.writeFileSync(logfile, "errror: ");

  fs.writeFileSync(logfile, "errror: " + error.toString());
}

// --- ТРЕЙ ---
const tray = new SysTray({
  menu: {
    label: "My Local App",
    items: [
      { title: "Открыть интерфейс", enabled: true },
      { title: "Выход", enabled: true },
    ],
  },
  copyDir: isBundle ? path.dirname(process.execPath) : undefined,
});

tray.onClick((action) => {
  if (action.item.title === "Выход") {
    db.close();
    process.exit();
  } else {
    openBrowser("http://localhost:3000");
  }
});

function extractBinary(exeDir) {
  const externalSQliteBinaryPath = path.join(exeDir, "better_sqlite3.node");
  const internalSQliteBinary = path.join(__dirname, "node_modules/better-sqlite3/build/Release/better_sqlite3.node");

  if (!fs.existsSync(externalSQliteBinaryPath)) {
    // В PKG ресурсы лежат по их реальному пути в проекте, но внутри /snapshot/
    fs.writeFileSync(externalSQliteBinaryPath, fs.readFileSync(internalSQliteBinary));
  }

  const internalTrayPath = path.join(__dirname, "node_modules/systray2/traybin/tray_windows_release.exe");
  const externalTrayPath = path.join(exeDir, "tray_windows_helper.exe");

  if (!fs.existsSync(externalTrayPath)) {
    fs.writeFileSync(externalTrayPath, fs.readFileSync(internalTrayPath));
  }

  return {externalSQliteBinaryPath, externalTrayPath};
}

function openBrowser(url) {
  const start = process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open";
  exec(`${start} ${url}`);
}
