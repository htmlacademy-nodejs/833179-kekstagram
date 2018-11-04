'use strict';

const colors = require(`colors`);

const author = require(`./author`);
const fill = require(`./fill`);
const server = require(`./server`);
const version = require(`./version`);

const help = {
  name: `help`,
  description: `печатает этот текст`,
  execute() {
    console.log(getCommandDescription(commandData));
    process.exit(0);
  }
};

const commandData = {
  author,
  fill,
  help,
  server,
  version,
};

const getCommandDescription = (commandInfo) => {
  const commands = Object.values(commandInfo)
    .map((command) => ({
      flag: colors.grey(`--${command.name}`),
      description: colors.green(command.description),
    }));
  const commandFlags = commands.map((command) => command.flag);
  const commandFlagLength = commandFlags.map((commandFlag) => commandFlag.length);
  const maxFlagLength = Math.max(...commandFlagLength);

  return commands
    .map((command) => `${command.flag.padEnd(maxFlagLength)} — ${command.description};`)
    .join(`\n`);
};

module.exports = help;
