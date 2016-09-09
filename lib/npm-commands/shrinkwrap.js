const debug = require('debug')('bundlejs:npm');
const npm = require('npm');

function shrinkwrap() {
  return new Promise((resolve, reject) => {
    debug('Running \'npm shrinkwrap --also=dev\'...');

    npm.config.set('only', null);
    npm.config.set('also', 'dev');

    npm.commands.shrinkwrap({}, (error) => (
      error ? reject(error) : resolve()
    ));
  });
}

module.exports = shrinkwrap;
