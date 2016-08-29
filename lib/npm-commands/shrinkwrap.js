const debug = require('debug')('bundlejs:npm');
const npm = require('npm');
const { getFlattenedDependencies, saveFile } = require('../util');
const version = require('../../package.json').version;

function saveFlattenedDependencies() {
  const dependencies = getFlattenedDependencies();
  const json = { dependencies, version };
  saveFile('.bundlerjs.json', json);
}

function shrinkwrap() {
  return new Promise((resolve, reject) => {
    debug('Running \'npm shrinkwrap --dev\'...');

    const dev = npm.config.get('dev');
    npm.config.set('dev', true);

    npm.commands.shrinkwrap({}, (error) => {
      // Reset 'dev' option back to the original value
      npm.config.set('dev', dev);

      if (error) {
        reject(error);
      } else {
        saveFlattenedDependencies();
        resolve();
      }
    });
  });
}

module.exports = shrinkwrap;
