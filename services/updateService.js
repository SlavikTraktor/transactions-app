const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const { appUpdateURL, tempDir, exeDir, isBundle } = require("../constants");
const { DB } = require("./db");

const appUpdateURL = "https://api.github.com/repos/SlavikTraktor/transactions-app/releases/latest";
const batPath = path.join(exeDir, "_update.bat");
const newExePath = path.join(tempDir, "transactions-app.exe");
const currentExe = path.join(exeDir, "transactions-app.exe");

class _UpdateService {
  constructor(db) {
    this.db = db;
  }

  async getLatestInfo() {
    const response = await fetch(appUpdateURL);
    return await response.json();
  }

  async getLatestVersion(info) {
    const data = info ? info : await this.getLatestInfo();
    return data.tag_name.replace("v", "");
  }

  getCurrentVersion() {
    const currentVersion = require("../package.json").version;
    return currentVersion;
  }

  createUpdateBatFile() {
    const batContent = `
        @echo off
        ping 127.0.0.1 -n 3 > nul
        move /Y "${newExePath}" "${currentExe}"
        ${isBundle ? `start "" "${currentExe}"` : ""}
        del "%~f0"
        `.trim();

    fs.writeFileSync(batPath, batContent);
  }

  replaceAppWithNewVersion() {
    // Запускаем bat и выходим
    spawn("cmd.exe", ["/c", batPath], {
      detached: true,
      stdio: "ignore",
    }).unref();
  }

  stopCurrentApp() {
    this.db.close();
    process.exit(0);
  }

  async updateAplication() {
    try {
      await this.downloadAppUpdate();
      this.createUpdateBatFile();
      this.replaceAppWithNewVersion(); // will replace the app and restart it, so we can exit current instance
      isBundle && this.stopCurrentApp();
    } catch (error) {
      console.log("Error applying update: " + error.message);
      throw new Error("Error applying update: " + error.message);
    }
  }

  async downloadAppUpdate() {
    const latestInfo = await this.getLatestInfo();
    const currentVersion = this.getCurrentVersion();
    const latestVersion = await this.getLatestVersion(latestInfo);

    // if (latestVersion.replace("v", "") === currentVersion) {
    //   return;
    // }
    const asset = latestInfo.assets[0];
    const downloadURL = asset.browser_download_url;

    this.createTempDir();

    const fileRes = await fetch(downloadURL, { headers: { "User-Agent": "Node.js" } });
    if (!fileRes.ok) throw new Error(`HTTP error: ${fileRes.status}`);
    const totalSizeKB = parseInt(fileRes.headers.get("content-length") || "0") / 1024; // Convert to KB

    const fileStream = fs.createWriteStream(path.join(tempDir, asset.name));
    const reader = fileRes.body.getReader();

    let downloaded = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      fileStream.write(Buffer.from(value));
      downloaded += value.length / 1024; // Convert to KB

      if (totalSizeKB > 0) {
        const percent = ((downloaded / totalSizeKB) * 100).toFixed(1);
        const mb = (downloaded / 1024).toFixed(1);
        const total = (totalSizeKB / 1024).toFixed(1);
        console.log(`Downloaded: ${mb} MB / ${total} MB (${percent}%)`);
      }
    }
    fileStream.end();
  }

  createTempDir() {
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }
  }
}

const UpdateService = new _UpdateService(DB);

module.exports = { UpdateService };
