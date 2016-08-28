const npm = require('npm');
const debug = require('debug')('bundlejs:npm');

function prune() {
  return new Promise((resolve, reject) => {
    debug('Running \'npm prune\'...');
    npm.commands.prune([], (error) => (
      error ? reject(error) : resolve()
    ));
  });
}

module.exports = prune;
