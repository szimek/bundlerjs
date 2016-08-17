/* eslint no-console: 0 */

const colors = require('colors');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const { readFile } = require('../util');

function verifyDependency(dependency) {
  const packagePath = path.join('node_modules', dependency.name, 'package.json');

  try {
    fs.accessSync(packagePath, fs.F_OK);
  } catch (error) {
    console.log(colors.red(`${dependency.name}@${dependency.version}: missing.`));
    return false;
  }

  const installedVersion = readFile(packagePath).version;
  const requiredVersion = dependency.version;

  if (installedVersion !== requiredVersion) {
    console.log(colors.red(
      `${dependency.name}@${dependency.version}: incorrect version installed ${installedVersion}.`
    ));
    return false;
  }

  return true;
}

function check() {
  const shrinkwrapPath = path.resolve(process.cwd(), 'npm-shrinkwrap.json');

  try {
    fs.accessSync(shrinkwrapPath, fs.F_OK);
  } catch (error) {
    console.log(
      'Could not locate npm-shrinkwrap.json file. ' +
      'Please run \'bundlejs install\' first.'
    );
    return 1;
  }

  const shrinkwrap = readFile(shrinkwrapPath);
  const dependencies = _(shrinkwrap.dependencies)
    .toPairs()
    .map((dependency) => (
      {
        name: dependency[0],
        version: dependency[1].version,
      }
    ));

  const hasPassed = dependencies
    .map(verifyDependency)
    .every((verification) => verification);

  if (hasPassed) {
    console.log(colors.green('All installed dependencies are correct!'));
    return 0;
  }

  console.warn(colors.red('Some installed dependencies are incorrect.'));
  return 1;
}

module.exports = check;
