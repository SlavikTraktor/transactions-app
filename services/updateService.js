const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const { tempDir, exeDir, isBundle } = require("../constants");
const { DB } = require("./db");
const { FileDownloadService } = require("./fileDownloadService");

const appUpdateURL = "https://api.github.com/repos/SlavikTraktor/transactions-app/releases/latest";
const batPath = path.join(exeDir, "_update.bat");
const newExePath = path.join(tempDir, "transactions-app.exe");
const currentExe = path.join(exeDir, "transactions-app.exe");

class _UpdateService {
  fileDownloadService = null;
  constructor(db) {
    this.db = db;
  }

  async getLatestInfo() {
    const response = await fetch(appUpdateURL);
    return await response.json();
  }

  async getLatestVersion(info = null) {
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
      const latestInfo = await this.getLatestInfo();
      if(!await this.doNeedUpdate(latestInfo)) {
        return;
      }
      await this.downloadAppUpdate(latestInfo.assets[0]);
      this.createUpdateBatFile();
      this.replaceAppWithNewVersion(); // will replace the app and restart it, so we can exit current instance
      isBundle && this.stopCurrentApp();
    } catch (error) {
      console.log("Error applying update: " + error.message);
      throw new Error("Error applying update: " + error.message);
    }
  }

  async downloadAppUpdate(asset) {
    const downloadURL = asset.browser_download_url;
    this.fileDownloadService = new FileDownloadService(tempDir);

    const filePath = await this.fileDownloadService.downloadFile(downloadURL, asset.name);
    return filePath;
  }

  async doNeedUpdate(latestInfo) {
    const currentVersion = this.getCurrentVersion();
    const latestVersion = await this.getLatestVersion(latestInfo);
    console.log(`Current version: ${currentVersion}, Latest version: ${latestVersion}`);
    return currentVersion !== latestVersion;
  }
}

const UpdateService = new _UpdateService(DB);

module.exports = { UpdateService };
