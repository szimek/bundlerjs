const npm = require('npm');
const debug = require('debug')('bundlejs:npm');

function install(args = []) {
  return new Promise((resolve, reject) => {
    debug('Running \'npm install\'...');
    npm.commands.install(args, (error) => (
      error ? reject(error) : resolve()
    ));
  });
}

module.exports = install;
