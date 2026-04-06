const SysTray = require("systray2").default;
const fs = require("fs");
const { exeDir, frontendURL, iconPath, isBundle } = require("../constants");
const { openBrowser } = require("../helpers/openBrowser");
const { Logger } = require("./logger");
const { UpdateService } = require("./updateService");


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
          { title: "Обновить приложение", enabled: true },
          { title: "Выход", enabled: true },
        ],
      },
      copyDir: isBundle ? exeDir : undefined,
    });

    tray.onClick((action) => {
      if (action.item.title === "Выход") {
        this.db.close();
        process.exit(0);
      } else if (action.item.title === "Обновить приложение") {
        console.log("Update requested");
        UpdateService.updateAplication().catch((error) => {
          Logger.error("Error downloading app update:", error.message);
        });
      } else {
        openBrowser(frontendURL);
      }
    });
  }
}

module.exports = { Systray };