const path = require('path');

const readRootPkgJson = function(cwd = process.cwd()) {
  return require(path.join(cwd, 'package.json'));
};

module.exports = readRootPkgJson;
