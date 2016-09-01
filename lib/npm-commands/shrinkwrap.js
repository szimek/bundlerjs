const debug = require('debug')('bundlejs:npm');
const npm = require('npm');

function shrinkwrap({ dev = true }) {
  return new Promise((resolve, reject) => {
    debug(`Running \'npm shrinkwrap${dev ? ' --dev' : ''}\'...`);

    npm.config.set('dev', dev);

    npm.commands.shrinkwrap({}, (error) => (
      error ? reject(error) : resolve()
    ));
  });
}

module.exports = shrinkwrap;
