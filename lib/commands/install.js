/* eslint no-console: "off" */

const debug = require('debug')('bundlejs:install');
const fs = require('fs');
const path = require('path');
const cmd = require('../npm-commands');
const { existsFile, loadNpm, npmOptions, calculatePackageHash, readFile } = require('../util');

function verifyPackageFileExists() {
  if (!existsFile('package.json')) {
    console.log('Could not locate package.json file');
    process.exit(1);
  }
}

function hasPackageFileChanged() {
  const shrinkwrapJson = readFile('npm-shrinkwrap.json');
  const storedHash = shrinkwrapJson.bundlejs && shrinkwrapJson.bundlejs.package;

  // If there's no hash in npm-shrinkwrap.json file, assume that package.json has changed.
  return calculatePackageHash() !== storedHash;
}

function removeShrinkwrapFile() {
  const shrinkwrapPath = path.resolve(npmOptions.prefix, 'npm-shrinkwrap.json');
  fs.unlinkSync(shrinkwrapPath);
}

function install() {
  verifyPackageFileExists();

  loadNpm(() => {
    // if shrinkwrap file exists and package.json has been changed: rm, prune, install, shrinkwrap
    // if shrinkwrap file exists and package.json has not been changed: prune and install
    // if shrinkwrap file does not exist: prune, install, shrinkwrap

    if (existsFile('npm-shrinkwrap.json')) {
      if (hasPackageFileChanged()) {
        removeShrinkwrapFile();
        cmd.prune().then(cmd.install).then(cmd.shrinkwrap);
      } else {
        cmd.prune().then(cmd.install);
      }
    } else {
      debug('Could not locate npm-shrinkwrap.json file');
      cmd.prune().then(cmd.install).then(cmd.shrinkwrap);
    }
  });

  return 0;
}

module.exports = install;
