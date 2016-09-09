const npm = require('npm');
const debug = require('debug')('bundlejs:npm');

function outdated() {
  return new Promise((resolve, reject) => {
    debug('Running \'npm outdated\'...');

    npm.config.set('json', true);
    npm.config.set('long', true);

    npm.config.set('only', null);
    npm.config.set('also', null);

    npm.commands.outdated({}, true, (error, result) => {
      if (error) { return reject(error); }

      return resolve(result.map((dep) => ({
        dep: dep[0],
        depname: dep[1],
        current: dep[2],
        wanted: dep[3],
        latest: dep[4],
        req: dep[5],
        type: dep[6],
        what: `${dep[1]}@${dep[3]}`,
      })));
    });
  });
}

module.exports = outdated;
