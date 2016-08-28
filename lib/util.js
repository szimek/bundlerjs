const fs = require('fs');
const _ = require('lodash');
const npm = require('npm');
const path = require('path');

const util = {
  existsFile(name) {
    try {
      const file = path.resolve(util.npmOptions.prefix, name);
      fs.accessSync(file, fs.F_OK);
      return true;
    } catch (error) {
      return false;
    }
  },

  readFile(name) {
    const filepath = path.resolve(util.npmOptions.prefix, name);
    const file = fs.readFileSync(filepath);
    return JSON.parse(file);
  },

  removeFile(name) {
    const file = path.resolve(util.npmOptions.prefix, name);
    fs.unlinkSync(file);
  },

  saveFile(name, json) {
    const filepath = path.resolve(util.npmOptions.prefix, name);
    fs.writeFileSync(filepath, JSON.stringify(json, null, 2));
  },

  getFlattenedDependencies() {
    const packagePath = path.resolve(util.npmOptions.prefix, 'package.json');
    const packageJson = util.readFile(packagePath);
    const dependencies = [
      packageJson.dependencies,
      packageJson.devDependencies,
      packageJson.optionalDependencies,
      packageJson.peerDependencies,
    ];

    return Object.assign({}, ...dependencies);
  },

  loadNpm(config = {}, callback) {
    const npmConfig = _.assign({}, config, util.npmOptions);
    return npm.load(npmConfig, () => callback(npm));
  },

  npmOptions: {
    prefix: process.cwd(),
    loglevel: 'error',
    dev: true,
  },
};

module.exports = util;
