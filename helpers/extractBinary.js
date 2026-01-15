const fs = require("fs");
const { externalSQliteBinaryPath, internalSQliteBinary, externalTrayPath, internalTrayPath } = require("../constants");

function extractBinary() {
  if (!fs.existsSync(externalSQliteBinaryPath)) {
    fs.writeFileSync(externalSQliteBinaryPath, fs.readFileSync(internalSQliteBinary));
  }

  if (!fs.existsSync(externalTrayPath)) {
    fs.writeFileSync(externalTrayPath, fs.readFileSync(internalTrayPath));
  }

  return { externalSQliteBinaryPath, externalTrayPath };
}

module.exports = { extractBinary };
