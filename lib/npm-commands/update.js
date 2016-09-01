const debug = require('debug')('bundlejs:npm');
const fs = require('fs');
const npm = require('npm');
const path = require('path');
const util = require('../util');

function update({ dev = true, names = [] }) {
  return new Promise((resolve, reject) => {
    // Only 'save' option updates npm-shrinkwrap.json file, so we don't care about --save-dev.
    npm.config.set('save', !dev);
    npm.config.set('save-dev', false);

    // Need to disable these options so that `npm update` doesn't print tons of unnecessary stuff.
    npm.config.set('json', false);
    npm.config.set('long', false);

    debug(`Running 'npm update --save ${names.join(', ')}'...`);

    const packageJsonFilePath = path.resolve(util.npmOptions.prefix, 'package.json');
    const packageJsonFile = fs.readFileSync(packageJsonFilePath);

    return npm.commands.update(names, (error) => {
      if (error) {
        return reject(error);
      }

      // Recreate package.json file modified by running 'npm update --save'.
      fs.writeFileSync(packageJsonFilePath, packageJsonFile);

      return resolve();
    });
  });
}

module.exports = update;
