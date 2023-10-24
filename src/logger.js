/* eslint-disable no-console */
const logger = {};
['error', 'warn', 'log', 'debug'].forEach((key) => {
  logger[key] = (...args) => args.unshift('npm-check-installed-git-tags:') && console[key](...args)
})
module.exports = logger;
