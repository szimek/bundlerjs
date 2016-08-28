Bundler.js
==============================
Bundler.js tries to bring the simplicity of Ruby [Bundler](https://bundler.io) to npm. It also <del>brings</del> steals some of its docs :wink:

## NOTE
At the moment it's just a proof of concept, highly experimental and not ready yet for production use.

## Usage
```
npm install --save-dev @szimek/bundlerjs
./node-modules/.bin/bundlejs <command>
```
or
```
npm install --global @szimek/bundlerjs
bundlejs <command>
```

To run bundler.js with debug output, run `DEBUG=* bundlejs <command>`.

### Recommended Workflow
In general, when working with an application managed with bundler.js, you should use the following workflow:

* After you create your `package.json` file for the first time, run

  `bundlejs install`

* Check the resulting `npm-shrinkwrap.json` and `.bundlerjs.json` files into version control

  `git add npm-shrinkwrap.json .bundlerjs.json`

* When checking out this repository on another development machine, run

  `bundlejs install`

* After changing the `package.json` file to reflect a new or update dependency, run

  `bundlejs install`

* Make sure to check the updated `npm-shrinkwrap.json` and `.bundlerjs.json` files into version control

  `git add npm-shrinkwrap.json .bundlerjs.json`

* If you want to update all the dependencies to the latest possible versions that still match the dependencies listed in the `package.json`, run

  `bundlejs update`

### CLI Commands
#### check
`bundlejs check` - Check if the dependencies listed in `npm-shrinkwrap.json` file are satisfied by currently installed packages

#### install (default command)
`bundlejs install` - Install the dependencies specified in your `package.json` file

If this is the first time you run `bundlejs install` (and a `npm-shrinkwrap.json` file does not exist), it will run `npm prune`, `npm install` and finally `npm shrinkwrap`.

If a `npm-shrinkwrap.json` file does exist, and you have not updated your `package.json` file, it will run `npm prune` and `npm install`.

If a `npm-shrinkwrap.json` does exist, and you have updated your `package.json`, it will remove `npm-shrinkwrap.json` file and then run `npm prune`, `npm install` and `npm shrinkwrap`.

#### update
`bundlejs update` - Update your dependencies to the latest available versions
##### Updating All Dependencies
`bundlejs update`
##### Updating A List Of Dependencies
`bundlejs update eslint` __NOT IMPLEMENTED YET__

### JavaScript API
```
const Bundler = require('bundlerjs');
const colors = require('colors');

// Asynchronous version
Bundler.check().then(
  () => { ... do whatever }
  (message) => {
    console.log(colors.red(message));
    process.exit(1);
  }
);

// Synchronous version
try {
  Bundler.checkSync();
} catch (error) {
  console.log(colors.red(error));
  process.exit(1);
}
```

## Known Issues
Bundler still uses npm to handle dependency resolution and locking and thus has all the issues npm has, e.g. it doesn't work properly with [peer dependencies](https://github.com/npm/npm/issues/12909). At the moment bundler.js only handles dependencies and devDependencies.
