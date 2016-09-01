/* eslint no-console: "off" */
const debug = require('debug')('bundlejs:update');
const _ = require('lodash');

const cmd = require('../npm-commands');
const {
  hasPackageFileChanged,
  loadNpm,
  saveFlattenedDependencies,
} = require('../util');

function update({ dev = true, packages = [] } = {}) {
  const promise = new Promise((resolve, reject) => {
    loadNpm({}, () => {
      cmd.outdated()
        .then(
          (result) => {
            const isSpecified = (dep) => (
              packages.length ? packages.indexOf(dep.depname) > -1 : true
            );
            const isUpdateable = (dep) => dep.wanted !== dep.current;
            const groupedPackages = _.groupBy(result, 'type');
            const deps = _(groupedPackages.dependencies)
              .filter(isSpecified)
              .filter(isUpdateable)
              .value();
            const devDeps = _(groupedPackages.devDependencies)
              .filter(isSpecified)
              .filter(isUpdateable)
              .value();
            const promises = [];

            if (deps.length) {
              const names = deps.map((dep) => dep.depname);
              debug(`Updating dependencies ${names.join(', ')}`);
              promises.push(cmd.update({ dev: false, names }));
            }

            if (devDeps.length) {
              const names = devDeps.map((dep) => dep.depname);
              debug(`Updating devDependencies ${names.join(', ')}`);
              promises.push(cmd.update({ dev, names }));
            }

            if (hasPackageFileChanged()) {
              saveFlattenedDependencies();
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
