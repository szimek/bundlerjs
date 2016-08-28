/* eslint no-console: "off" */
const debug = require('debug')('bundlejs:update');
const groupBy = require('lodash/groupBy');
const _ = require('lodash');

const cmd = require('../npm-commands');
const { loadNpm } = require('../util');

function update() {
  const promise = new Promise((resolve, reject) => {
    loadNpm({}, () => {
      cmd.outdated()
        .then(
          (result) => {
            const isUpdateable = (dep) => dep.wanted !== dep.current;
            const groupedPackages = groupBy(result, 'type');
            const deps = _.filter(groupedPackages.dependencies, isUpdateable);
            const devDeps = _.filter(groupedPackages.devDependencies, isUpdateable);
            const promises = [];

            if (deps.length) {
              const names = deps.map((dep) => dep.depname);
              debug(`Updating dependencies ${names.join(', ')}`);
              promises.push(cmd.update({ type: 'dependencies', names }));
            }

            if (devDeps.length) {
              const names = devDeps.map((dep) => dep.depname);
              debug(`Updating devDependencies ${names.join(', ')}`);
              promises.push(cmd.update({ type: 'devDependencies', names }));
            }

            Promise
              .all(promises)
              .then(resolve, reject);
          },
          reject
        );
    });
  });

  return promise.then(() => '\nBundle complete!');
}

module.exports = update;
