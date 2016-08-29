const npm = require('npm');
const debug = require('debug')('bundlejs:npm');

function install(args = []) {
  return new Promise((resolve, reject) => {
    debug('Running \'npm install\'...');

    npm.config.set('save', false);
    npm.config.set('save-dev', false);

    // Need to disable these options so that `npm install` doesn't print tons of unnecessary stuff
    npm.config.set('json', false);
    npm.config.set('long', false);

    npm.commands.install(args, (error) => (
      error ? reject(error) : resolve()
    ));
  });
}

module.exports = install;
