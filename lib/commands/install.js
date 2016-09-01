/* eslint no-console: "off" */

const debug = require('debug')('bundlejs:install');
const cmd = require('../npm-commands');
const {
  existsFile,
  removeFile,
  hasPackageFileChanged,
  loadNpm,
  saveFlattenedDependencies,
} = require('../util');

function verifyPackageFileExists() {
  if (!existsFile('package.json')) {
    console.log('Could not locate package.json file');
    process.exit(1);
  }
}

function install({ dev = true } = {}) {
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
            .then(() => removeFile('npm-shrinkwrap.json'))
            .then(cmd.prune)
            .then(cmd.install)
            .then(() => cmd.shrinkwrap({ dev }))
            .then(saveFlattenedDependencies)
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
          .then(() => cmd.shrinkwrap({ dev }))
          .then(saveFlattenedDependencies)
          .then(resolve, reject);
      }
    });
  });

  return promise.then(() => '\nBundle complete!');
}

module.exports = install;
