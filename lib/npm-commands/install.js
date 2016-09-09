const npm = require('npm');
const debug = require('debug')('bundlejs:npm');

function install({ only } = {}) {
  return new Promise((resolve, reject) => {
    debug('Running \'npm install\'...');

    // We don't want to update package.json file and shrinwrap file will be recreated
    // in a separate step, so these should be disabled.
    npm.config.set('save', false);
    npm.config.set('save-dev', false);

    if (only) { npm.config.set('only', only); }
    npm.config.set('also', null);

    // Need to disable these options so that `npm install` doesn't print tons of unnecessary stuff.
    npm.config.set('json', false);
    npm.config.set('long', false);

    npm.commands.install([], (error) => (
      error ? reject(error) : resolve()
    ));
  });
}

module.exports = install;
