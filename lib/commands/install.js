/* eslint no-console: "off" */

// const colors = require('colors');
const debug = require('debug')('bundlejs:install');
const _ = require('lodash');
const cmd = require('../npm-commands');
const {
  existsFile,
  readFile,
  removeFile,
  loadNpm,
  getFlattenedDependencies,
} = require('../util');

// TODO: move to util
function verifyPackageFileExists() {
  if (!existsFile('package.json')) {
    console.log('Could not locate package.json file');
    process.exit(1);
  }
}

// TODO: move to util
function hasPackageFileChanged() {
  const bundlerFile = readFile('.bundlerjs.json');
  const dependenciesFromBundlerFile = bundlerFile ? bundlerFile.dependencies : {};
  const dependenciesFromPackageFile = getFlattenedDependencies();

  // If there's no .bundlerjs.json file, assume that package.json has changed.
  return !_.isEqual(dependenciesFromPackageFile, dependenciesFromBundlerFile);
}

function install() {
  verifyPackageFileExists();

  const promise = new Promise((resolve, reject) => {
    loadNpm({}, () => {
      // If shrinkwrap file exists and package.json has been changed then
      // remove old shriknkwrap.json file, run 'npm prune', 'npm install' and 'npm shrinkwrap'.
      //
      // If shrinkwrap file exists and package.json has not been changed then
      // run 'npm prune' and 'npm install'.
      //
      // If shrinkwrap file does not exist then
      // run 'npm prune', 'npm install' and 'npm shrinkwrap'.
      if (existsFile('npm-shrinkwrap.json')) {
        debug('Found npm-shrinkwrap.json file');
        if (hasPackageFileChanged()) {
          debug('Changes detected in package.json file');
          cmd.prune()
            .then(cmd.install)
            .then(() => {
              debug('Removing shrinkwrap.json file');
              removeFile('npm-shrinkwrap.json');
            })
            .then(cmd.prune)
            .then(cmd.install)
            .then(cmd.shrinkwrap)
            .then(resolve, reject);
        } else {
          debug('No changes detected in package.json file');
          cmd.prune()
            .then(cmd.install)
            .then(resolve, reject);
        }
      } else {
        debug('Could not locate npm-shrinkwrap.json file');
        cmd.prune()
          .then(cmd.install)
          .then(cmd.shrinkwrap)
          .then(resolve, reject);
      }
    });
  });

  return promise.then(() => '\nBundle complete!');
}

module.exports = install;
