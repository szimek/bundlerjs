const crypto = require('crypto');
const fs = require('fs');
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

  loadNpm(callback) {
    return npm.load(util.npmOptions, () => callback(npm));
  },

  npmOptions: {
    prefix: process.cwd(),
    loglevel: 'error',
    dev: true,
  },

  calculatePackageHash() {
    const packagePath = path.resolve(util.npmOptions.prefix, 'package.json');
    const packageJson = util.readFile(packagePath);
    const data =
      JSON.stringify(packageJson.devDependencies) +
      JSON.stringify(packageJson.dependencies);

    return crypto
      .createHash('md5')
      .update(data)
      .digest('hex');
  },

  readFile(name) {
    const filepath = path.resolve(util.npmOptions.prefix, name);
    const file = fs.readFileSync(filepath);
    return JSON.parse(file);
  },

  saveFile(name, json) {
    const filepath = path.resolve(util.npmOptions.prefix, name);
    fs.writeFileSync(filepath, JSON.stringify(json, null, 2));
  },
};

module.exports = util;
