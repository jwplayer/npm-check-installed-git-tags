const getDefaultDir = () => process.env.INIT_CWD ? process.env.INIT_CWD : process.cwd();

module.exports = getDefaultDir;
