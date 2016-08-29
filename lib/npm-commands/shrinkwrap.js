const debug = require('debug')('bundlejs:npm');
const npm = require('npm');
const util = require('../util');

function shrinkwrap() {
  return new Promise((resolve, reject) => {
    debug('Running \'npm shrinkwrap --dev\'...');

    npm.config.set('dev', true);

    npm.commands.shrinkwrap({}, (error) => {
      if (error) {
        reject(error);
      } else {
        util.saveFlattenedDependencies();
        resolve();
      }
    });
  });
}

module.exports = shrinkwrap;
