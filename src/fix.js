#!/usr/bin/env node
const ENV_VAR = require('./env-var.js');
const printError = require('./print-error.js');
const getPackageErrors = require('./get-package-errors.js');
const readPkgJson = require('./read-root-pkg-json.js');
const {execSync} = require('child_process');
const getDefaultDir = require('./get-default-dir')
const logger = require('./logger');

const fix = function(cwd = getDefaultDir()) {
  const packageErrors = getPackageErrors(cwd);

  if (!packageErrors.length) {
    logger.log('all git version tags match what is installed.');
    return 0;
  }

  const env = Object.assign({[ENV_VAR]: "1"}, process.env);

  const devFixes = [];
  const fixes = [];
  const pkgJson = readPkgJson(cwd);

  for (const {pkgName, expectedVersion, installedVersion, saveSpec} of packageErrors) {
    // if the package is in dependencies that version will be prioritized
    const flag = !pkgJson?.dependencies?.[pkgName] ? '--save-dev' : '';

    const installString = `${pkgName}@${saveSpec}`;

    if (!pkgJson?.dependencies?.[pkgName]) {
      devFixes.push(installString);
    } else {
      fixes.push(installString);
    }

    logger.warn(`found ${installString} incorrectly installed as ${installedVersion}.`);
  }

  if (devFixes.length) {
    logger.warn('Attempting to fix devDependencies');
    execSync(`npm install --save-dev ${devFixes.join(' ')}`, {env, stdio: 'inherit'});
  }

  if (fixes.length) {
    logger.warn('Attempting to fix dependencies');
    execSync(`npm install ${fixes.join(' ')}`, {env, stdio: 'inherit'});
  }

  const fixedPackageErrors = getPackageErrors(cwd);

  if (!fixedPackageErrors.length) {
    logger.log('Successfully fixed git tag version issues')
    logger.log('add package.json/package-lock.json to a git commit.')
    return 0;
  }

  printError(fixedPackageErrors);
  return 1;
};

module.exports = fix;

// The code below will only run when working as an executable
// that way we can test the cli using require in unit tests.
if (require.main === module && !Object.hasOwn(process.env, ENV_VAR)) {
  const exitCode = fix();

  process.exit(exitCode);
}

