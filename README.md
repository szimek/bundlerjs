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

* You can also use bundler.js to automatically check if the dependencies listed in `npm-shrinkwrap.json` file are satisfied by currently installed packages before you run any task. You can add `Bundler.checkSync()` call at the top of your `webpack.config.js`, `Gruntfile`, `Gulpfile.js` etc. If you use npm scripts, you can just call `bundlejs check` before your own script, e.g. `'start': 'bundlejs check && webpack-dev-server'`.


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
`bundlejs update eslint eslint-config-airbnb-base`

### JavaScript API
`Bundler.check()`
``` javascript
const Bundler = require('bundlerjs');
const colors = require('colors');

Bundler.check().then(
  () => { /* everything is ok, do whatever */ }
  (error) => {
    console.log(colors.red(error));
    process.exit(1);
  }
);
```

`Bundler.checkSync()` - synchronous version of `check()`
``` javascript
try {
  Bundler.checkSync();
} catch (error) {
  console.log(colors.red(error));
  process.exit(1);
}

// everything is ok, do whatever
```

`Bundler.install()`

`Bundler.update()`

## Known Issues
Bundler still uses npm to handle dependency resolution and locking and thus has all the issues npm has, e.g.
* it doesn't work properly with [peer dependencies](https://github.com/npm/npm/issues/12909).
* it creates an [`etc` folder](https://github.com/npm/npm/pull/7249).

At the moment bundler.js only handles dependencies and devDependencies.
