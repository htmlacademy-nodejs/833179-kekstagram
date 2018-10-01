'use strict';

const colors = require(`colors`);

const author = require(`./author`);
const description = require(`./description`);
const license = require(`./license`);
const version = require(`./version`);

const help = {
  name: `help`,
  description: `печатает этот текст`,
  execute() {
    console.log(getCommandDescription(commandData));
  }
};

const commandData = {
  author,
  description,
  help,
  license,
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
