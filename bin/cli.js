#!/usr/bin/env node
/* eslint no-console: "off" */

const colors = require('colors');
const yargs = require('yargs');
const Bundler = require('../lib/bundler');
const version = require('../package.json').version;

function onSuccess(message) {
  if (message) console.log(colors.green(message));
  process.exit(0);
}

function onError(message) {
  if (message) console.log(colors.red(message));
  process.exit(0);
}

yargs
  .command(
    'check',
    // eslint-disable-next-line max-len
    'Check if the dependencies listed in package.json are satisfied by currently installed packages',
    {},
    () => Bundler.check().then(onSuccess, onError)
  );

yargs
  .command(
    'install [dev]',
    ' Install the dependencies specified in your package.json file',
    { dev: {
      alias: 'D',
      default: false,
      describe: 'Shrinkwrap development dependencies as well' },
    },
    (args) => {
      Bundler.install({ dev: args.dev })
        .then(onSuccess, onError);
    }
  );

yargs
  .command(
    'update [dev] [packages..]',
    'Update the dependencies specified in your package.json file',
    { dev: {
      alias: 'D',
      default: false,
      describe: 'Shrinkwrap development dependencies as well',
    } },
    (args) => {
      Bundler.update({ dev: args.dev, pacakges: args.packages })
        .then(onSuccess, onError);
    }
  );


yargs
  .alias('h', 'help')
  .usage('Usage: $0 <command>')
  .help();

yargs
  .alias('v', 'version')
  .version(version);

// Calling yargs.argv resets list of registered commands, so this needs to be called before
const availableCommands = yargs.getCommandInstance().getCommands().concat('help');
const argv = yargs.argv;
const commands = argv._;
const command = commands[0];

// Super lame way of handling the default and invalid commands, but it looks like this
// functionality is not provided by yargs.js :/
if (!commands.length) {
  Bundler.install({ dev: argv.dev || false })
    .then(onSuccess, onError);
} else if (availableCommands.indexOf(command) === -1 || commands.length > 1) {
  // eslint-disable-next-line no-console
  console.log(colors.red(`Could not find command "${command}".`));
}
