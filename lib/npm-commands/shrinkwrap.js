const debug = require('debug')('bundlejs:npm');
const npm = require('npm');
const { calculatePackageHash, readFile, saveFile } = require('../util');

function savePackageHashToShrinkwrapFile() {
  const hash = calculatePackageHash();
  const shrinkwrapJson = readFile('npm-shrinkwrap.json');

  shrinkwrapJson.bundlejs = { package: hash };
  saveFile('npm-shrinkwrap.json', shrinkwrapJson);
}

function shrinkwrap() {
  return new Promise((resolve, reject) => {
    debug('Running \'npm shrinkwrap\'...');
    npm.commands.shrinkwrap({}, true, (error) => {
      if (error) {
        reject(error);
      } else {
        savePackageHashToShrinkwrapFile();
        resolve();
      }
    });
  });
}

module.exports = shrinkwrap;
