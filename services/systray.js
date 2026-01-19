const SysTray = require("systray2").default;
const fs = require("fs");
const { exeDir, frontendURL, iconPath, isBundle } = require("../constants");
const { openBrowser } = require("../helpers/openBrowser");


class Systray {
  constructor(db) {
    this.db = db;
  }

  init() {
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
        this.db.close();
        process.exit();
      } else {
        openBrowser(frontendURL);
      }
    });
  }
}

module.exports = { Systray };