/* eslint no-console: 0 */

const checkSync = require('./check-sync');

function check() {
  return new Promise((resolve, reject) => {
    try {
      const message = checkSync();
      resolve(message);
    } catch (error) {
      reject(error.message);
    }
  });
}

module.exports = check;
