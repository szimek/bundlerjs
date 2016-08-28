const check = require('./commands/check');
const checkSync = require('./commands/check-sync');
const install = require('./commands/install');
const update = require('./commands/update');

const Bundler = {
  check,
  checkSync,
  install,
  update,
};

module.exports = Bundler;
