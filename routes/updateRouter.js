const express = require("express");
const { UpdateService } = require("../services/updateService");
const { Logger } = require("../services/logger");

const router = express.Router();

router.get("/version-info", async (req, res) => {
  res.json({
    currentVersion: UpdateService.getCurrentVersion(),
    latestVersion: await UpdateService.getLatestVersion(),
  });
});

router.post("/start-update", (req, res) => {
  UpdateService.updateAplication().catch((error) => {
    Logger.error("Error in app update:", error);
  });

  res.json({
    message: "Update process started",
  });
});

router.get("/update-status", (req, res) => {
  res.json(UpdateService.getCurrentStatus());
});

module.exports = router;
