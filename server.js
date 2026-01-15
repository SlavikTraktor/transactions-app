const express = require("express");
const path = require("path");
const fs = require("fs");
const SysTray = require("systray2").default;
const { exec } = require("child_process");
const { exeDir, isBundle } = require("./constants");
const { Logger } = require("./services/logger");
const { DB } = require("./services/db");
const { extractBinary } = require("./helpers/extractBinary");

if (isBundle) {
  extractBinary(exeDir);
}

DB.run(
  `
  CREATE TABLE IF NOT EXISTS sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL
  )
`,
);

DB.run(
  `
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL,
    amount REAL NOT NULL,
    description TEXT,
    sender TEXT,
    currency TEXT NOT NULL,
    source_id INTEGER,
    FOREIGN KEY (source_id) REFERENCES sources(id)
  )
`,
);

try {
  // --- СЕРВЕР ---
  const app = express();
  app.use(express.json());

  // Раздача фронтенда (папка dist должна быть внутри ресурсов nexe)
  const distPath = path.join(__dirname, "frontend/dist");
  app.use(express.static(distPath));

  // API Эндпоинты
  app.get("/api/settings", (req, res) => {
    const rows = DB.prepare("SELECT * FROM settings").all();
    res.json(rows);
  });

  app.post("/api/settings", (req, res) => {
    const { key, value } = req.body;
    DB.run("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", [key, value]);
    res.json({ success: true });
  });

  // SPA роутинг: всё остальное в index.html
  app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });

  const server = app.listen(3000, async () => {
    console.log("Сервер запущен на http://localhost:3000");
    Logger.log("Сервер запущен на http://localhost:3000");
    //   openBrowser("http://localhost:3000");
  });
} catch (error) {
  Logger.error(error.toString());
}

const iconPath = path.join(__dirname, "assets", "icon.ico");
const iconBase64 = fs.readFileSync(iconPath).toString("base64");

const tray = new SysTray({
  menu: {
    icon: iconBase64,
    title: "STransactions",
    label: "STransactions",
    items: [
      { title: "Открыть интерфейс", enabled: true },
      { title: "Выход", enabled: true },
    ],
  },
  copyDir: isBundle ? exeDir : undefined,
});

tray.onClick((action) => {
  if (action.item.title === "Выход") {
    DB.close();
    process.exit();
  } else {
    openBrowser("http://localhost:3000");
  }
});

function openBrowser(url) {
  const start = process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open";
  exec(`${start} ${url}`);
}
