const npm = require('npm');
const debug = require('debug')('bundlejs:npm');

function prune() {
  return new Promise((resolve, reject) => {
    debug('Running \'npm prune\'...');
    npm.commands.prune([], (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

module.exports = prune;
