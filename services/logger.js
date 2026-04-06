const fs = require("fs");
const { logfile } = require("../constants");

class _Logger {
  constructor(logfile) {
    this.logfile = logfile;
    if (!fs.existsSync(this.logfile)) {
      fs.writeFileSync(this.logfile, "");
    }
  }

  log(message) {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(this.logfile, `[${timestamp}] ${message}\n`);
  }

  error(message, ...args) {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(this.logfile, `[${timestamp}] ERROR: ${message}\n${JSON.stringify(args)}`, );
  }
}

const Logger = new _Logger(logfile);

module.exports = { Logger };
