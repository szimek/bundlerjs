#!/usr/bin/env node
const commander = require('commander');
const CLIEngine = require('../lib/cli-engine');

// TODO use process.exit(<code>) on errors

commander
  .version('0.0.1')
  .arguments('<command>')
  .action((command) => {
    switch (command) {
      case 'check':
        CLIEngine.check();
        break;
      case 'install':
      default:
        CLIEngine.install();
    }
  })
  .parse(process.argv);
