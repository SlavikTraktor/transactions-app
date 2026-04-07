const fs = require("fs");
const path = require("path");

class FileDownloadService {
  downloadedMB = 0;
  totalSizeMB = 0;
  percent = 0;

  constructor(tempDir) {
    this.tempDir = tempDir;
  }

  async downloadFile(downloadURL, outputName) {
    this.#createTempDir();

    const fileRes = await fetch(downloadURL, { headers: { "User-Agent": "Node.js" } });
    if (!fileRes.ok) throw new Error(`HTTP error: ${fileRes.status}`);
    this.totalSizeMB = parseInt(fileRes.headers.get("content-length") || "0") / 1024 / 1024; // Convert to MB

    const filePath = path.join(this.tempDir, outputName);
    const fileStream = fs.createWriteStream(filePath);
    const reader = fileRes.body.getReader();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      fileStream.write(Buffer.from(value));
      this.downloadedMB += value.length / 1024 / 1024; // Convert to MB

      if (this.totalSizeMB > 0) {
        this.percent = ((this.downloadedMB / this.totalSizeMB) * 100).toFixed(1);
        console.log(`Downloaded: ${this.downloadedMB.toFixed(1)} MB / ${this.totalSizeMB.toFixed(1)} MB (${this.percent}%)`);
      }
    }
    fileStream.end();

    return filePath;
  }

  #createTempDir() {
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir);
    }
  }
}

module.exports = { FileDownloadService };
