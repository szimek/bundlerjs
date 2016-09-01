const npm = require('npm');
const debug = require('debug')('bundlejs:npm');

function install() {
  return new Promise((resolve, reject) => {
    debug('Running \'npm install\'...');

    // Don't update package.json and npm-shrinkwrap.json files. The latter one will be recreated
    // from scratch.
    npm.config.set('save', false);
    npm.config.set('save-dev', false);

    // Need to disable these options so that `npm install` doesn't print tons of unnecessary stuff.
    npm.config.set('json', false);
    npm.config.set('long', false);

    npm.commands.install([], (error) => (
      error ? reject(error) : resolve()
    ));
  });
}

module.exports = install;
