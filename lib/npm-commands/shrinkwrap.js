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
    debug('Running \'npm shrinkwrap\'...');
    npm.commands.shrinkwrap({}, (error) => {
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
