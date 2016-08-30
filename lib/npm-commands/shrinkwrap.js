const debug = require('debug')('bundlejs:npm');
const npm = require('npm');

function shrinkwrap() {
  return new Promise((resolve, reject) => {
    debug('Running \'npm shrinkwrap --dev\'...');

    npm.config.set('dev', true);

    npm.commands.shrinkwrap({}, (error) => (
      error ? reject(error) : resolve()
    ));
  });
}

module.exports = shrinkwrap;
