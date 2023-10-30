const npa = require('npm-package-arg');
const readRootPkgJson = require('./read-root-pkg-json');
const fs = require('fs');
const semverValid = require('semver/functions/valid');

const getPackageErrors = function(cwd) {
  const pkgJson = readRootPkgJson(cwd);
  const all = Object.assign({}, pkgJson?.dependencies, pkgJson?.devDependencies)
  const packagesWithErrors = [];

  for (const [pkgName, pkgVersion] of Object.entries(all)) {
    const result = npa(pkgVersion);

    // if it isn't a git dependency or it is versioned using the main branch
    // then it cannot be wrong
    if (result.type !== 'git' || !result.gitCommittish) {
      continue
    }

    const installPath = require.resolve(`${pkgName}/package.json`, {paths: [cwd]});
    const installedVersion = JSON.parse(fs.readFileSync(installPath)).version;

    // not a git tag version
    if (!result.gitCommittish || result.gitCommittish.indexOf('v') !== 0) {
      continue;
    }

    const expectedVersion = result.gitCommittish
      .replace('semver:', '')
      .replace('v', '');

    if (!semverValid(expectedVersion)) {
      continue;
    }

    // if versions match than it is the correct git version
    if (installedVersion === expectedVersion) {
      continue
    }

    packagesWithErrors.push({pkgName, installedVersion, expectedVersion, saveSpec: result.saveSpec})
  }

  return packagesWithErrors;
};

module.exports = getPackageErrors;
