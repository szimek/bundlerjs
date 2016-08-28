/* eslint no-console: 0 */

const colors = require('colors');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const { existsFile, readFile } = require('../util');

function hasCorrectVersion(dependency) {
  const packagePath = path.join('node_modules', dependency.name, 'package.json');

  try {
    fs.accessSync(packagePath, fs.F_OK);
  } catch (error) {
    console.log(colors.red(
      `${dependency.name}: required version ${dependency.version}, but not found.`
    ));
    return false;
  }

  const installedVersion = readFile(packagePath).version;
  const requiredVersion = dependency.version;

  if (installedVersion !== requiredVersion) {
    console.log(colors.red(
      // eslint-disable-next-line max-len
      `${dependency.name}: required version ${dependency.version}, but installed ${installedVersion}.`
    ));
    return false;
  }

  return true;
}

function checkSync() {
  if (existsFile('npm-shrinkwrap.json')) {
    const shrinkwrap = readFile('npm-shrinkwrap.json');
    const hasPassed = _(shrinkwrap.dependencies)
    .toPairs()
    .map((dependency) => ({
      name: dependency[0],
      version: dependency[1].version,
    }))
    .every(hasCorrectVersion);

    if (hasPassed) {
      return 'All installed dependencies are correct!';
    }

    throw new Error(
      'Some installed dependencies are incorrect. Run "bundlejs install" to fix it.'
    );
  }

  throw new Error(
    'Could not locate npm-shrinkwrap.json file. ' +
    'Please run "bundlejs install" first.'
  );
}

module.exports = checkSync;
