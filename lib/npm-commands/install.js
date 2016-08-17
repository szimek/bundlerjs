const npm = require('npm');
const debug = require('debug')('bundlejs:npm');

function install() {
  return new Promise((resolve, reject) => {
    debug('Running \'npm install\'...');
    npm.commands.install([], (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

module.exports = install;
