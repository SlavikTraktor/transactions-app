const express = require("express");
const { UpdateService } = require("../services/updateService");

const router = express.Router();

router.get("/version-info", async (req, res) => {

  res.json({
    currentVersion: UpdateService.getCurrentVersion(),
    latestVersion: await UpdateService.getLatestVersion(),
  });
});

module.exports = router;
