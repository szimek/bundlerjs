const check = require('./commands/check');
const install = require('./commands/install');

const CLIEngine = {
  check,
  install,
};

module.exports = CLIEngine;
