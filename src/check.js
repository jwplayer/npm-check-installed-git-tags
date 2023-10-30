#!/usr/bin/env node
const ENV_VAR = require('./env-var.js');
const printError = require('./print-error.js');
const getPackageErrors = require('./get-package-errors.js');
const getDefaultDir = require('./get-default-dir')
const logger = require('./logger.js');
const exitIfNotRootPkg = require('./exit-if-not-root-pkg.js');

const check = function(cwd = getDefaultDir()) {
  const packageErrors = getPackageErrors(cwd);

  if (!packageErrors.length) {
    logger.log('all git version tags match what is installed.');
    return 0;
  }

  printError(packageErrors);

  return 1;
};

module.exports = check;

// The code below will only run when working as an executable
// that way we can test the cli using require in unit tests.
if (require.main === module && !Object.hasOwn(process.env, ENV_VAR)) {
  exitIfNotRootPkg();
  const exitCode = check();

  process.exit(exitCode);
}
