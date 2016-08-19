BundlerJS
==============================
Bundler.js tries to bring the simplicity of Ruby Bundler to npm.

## NOTE
This is highly experimental and not ready yet for production (or actually any) use.

## Installation
```
npm install @szimek/bundlerjs
```
## Usage
```
bundlejs <command>
```

### CLI commands
#### install
`bundlejs install` - Install the dependencies specified in your `package.json` file

If this is the first time you run `bundlejs install` (and a `npm-shrinkwrap.json` file does not exist), it will run `npm prune`, `npm install` and finally `npm shrinkwrap`.

If a `npm-shrinkwrap.json` file does exist, and you have not updated your `package.json` file, it will run `npm prune` and `npm install`.

If a `npm-shrinkwrap.json` does exist, and you have updated your `package.json`, it will remove `npm-shrinkwrap.json` file and then run `npm prune`, `npm install` and `npm shrinkwrap`.

NOTE: The last case will most likely be changed to install/update only added/modified package definitions, if I only figure out how to track what exactly has changed in `package.json` file.

#### check
`bundlejs check` - Check if the dependencies listed in `npm-shrinkwrap.json` file are satisfied by currently installed packages

### JavaScript API
```
const Bundler = require('bundlerjs');
const colors = require('colors');

Bundler.check().then(
  () => { ... do whatever }
  (message) => {
    console.log(colors.red(message));
    process.exit(1);
  }
);
```
NOTE: `Bundler.check` method will most likely be changed to a sync version, so that it's easier to put it e.g. on top of your `webpack.config.js`, `Gulpfile.js`, `Gruntfile` etc., so that it can run the check before any other task.
