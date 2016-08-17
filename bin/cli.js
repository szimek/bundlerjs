#!/usr/bin/env node
const colors = require('colors');
const yargs = require('yargs');
const CLIEngine = require('../lib/cli-engine');
const version = require('../package.json').version;

// TODO use process.exit(<code>) on errors

yargs
  .command(
    'check',
    // eslint-disable-next-line max-len
    'Check if the dependencies listed in package.json are satisfied by currently installed packages',
    {},
    CLIEngine.check
  );

yargs
  .command(
    'install',
    ' Install the dependencies specified in your package.json',
    {},
    CLIEngine.install
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

// Lame way of handling the default and invalid commands
if (!commands.length) {
  CLIEngine.install();
} else if (availableCommands.indexOf(command) === -1 || commands.length > 1) {
  console.log(colors.red(`Could not find command "${command}".`));
}
