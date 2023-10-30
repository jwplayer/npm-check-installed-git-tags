const logger = require('./logger.js');

const exitIfNotRootPkg = (cwd) => {
  // this is not an install lifecycle script
  if (!process.env.npm_lifecycle_event || process.env.npm_lifecycle_event.indexOf('install') === -1) {
    return;
  }

  // this is a local npm install lifecycle script
  if (process.env?.INIT_CWD === process.cwd()) {
    return;
  }

  logger.log("Skipping for non-root installation");
  process.exit(0);
};

module.exports = exitIfNotRootPkg;
