const npm = require('npm');
const debug = require('debug')('bundlejs:npm');

function update({ type, names } = {}) {
  return new Promise((resolve, reject) => {
    switch (type) {
      case 'dependencies':
        npm.config.set('save', true);
        npm.config.set('save-dev', false);
        debug(`Running 'npm update --save ${names.join(', ')}'...`);
        break;
      case 'devDependencies':
        npm.config.set('save', false);
        npm.config.set('save-dev', true);
        debug(`Running 'npm update --save-dev ${names.join(', ')}'...`);
        break;
      default:
        npm.config.set('save', false);
        npm.config.set('save-dev', false);
        debug(`Running 'npm update ${names.join(', ')}'...`);
    }

    return npm.commands.update(names, (error) => (
      error ? reject(error) : resolve()
    ));
  });
}

module.exports = update;
