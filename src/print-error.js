const logger = require('./logger.js');

const printError = (packageErrors) => {
  logger.error('Dependencies with git repo as version do not match what is installed.');
  logger.error('Please run `npx npm-check-installed-git-tags-and-fix` (faster) or `rm package-lock.json && npm i` (slower) to fix:');
  packageErrors.forEach(({pkgName, installedVersion, saveSpec}) => {
    logger.error(`${pkgName}@${saveSpec} expected but v${installedVersion} was installed.`);
  });
};

module.exports = printError;
