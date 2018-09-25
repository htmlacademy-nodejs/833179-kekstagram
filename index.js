const LF = '\r\n';

const ERROR_CODE = 1;
const SUCCESS_CODE = 0;

const COMMAND_TYPE_UNKNOWN = 'COMMAND_TYPE_UNKNOWN';
const COMMAND_TYPE_KNOWN = 'COMMAND_TYPE_KNOWN';
const COMMAND_TYPE_ABSENT = 'COMMAND_TYPE_ABSENT';

const COMMAND_FLAG_PREFIX = '--';
const getCommandName = commandFlag => commandFlag.split(COMMAND_FLAG_PREFIX)[1];
const getCommandFlag = commandName => `${COMMAND_FLAG_PREFIX}${commandName}`;

const getCurrentCommandFlag = input => input[2];
const input = process.argv;

class Kekstagram {
  constructor(input) {
    this.input = input;

    this.projectInfo = {
      name: 'Кекстаграмм',
      author: 'Кекс',
      version: '1.0.0',
    };

    this.commandInfo = {
      help: {
        name: 'help',
        description: 'печатает этот текст',
        message: () => (
          `Доступные команды:${LF
          }${this.getCommandDescription(this.commandInfo)}`),
        exitCode: SUCCESS_CODE,
      },
      version: {
        name: 'version',
        description: 'печатает версию приложения',
        message: () => `v${this.projectInfo.version}`,
        exitCode: SUCCESS_CODE,
      },
      [COMMAND_TYPE_ABSENT]: {
        message: () => (
          `Привет пользователь!${LF
          }Эта программа будет запускать сервер «${this.projectInfo.name}».${LF
          }Автор: ${this.projectInfo.author}.`),
        exitCode: SUCCESS_CODE,
        isUtilityCommand: true,
      },
      [COMMAND_TYPE_UNKNOWN]: {
        message: commandName => (
          `Неизвестная команда ${commandName}.${LF
          }Чтобы прочитать правила использования приложения, наберите "${getCommandFlag(this.commandInfo.help.name)}"`),
        exitCode: ERROR_CODE,
        isUtilityCommand: true,
      },
    };

    this.output = this.getOutput(this.input);
    this.logOutput(this.output);
  }

  getCommandDescription(commandsInfo) {
    const commands = Object.values(commandsInfo)
      .filter(command => !command.isUtilityCommand)
      .map(command => ({
        flag: getCommandFlag(command.name),
        description: command.description,
      }));
    const commandFlags = commands.map(command => command.flag);
    const commandFlagLength = commandFlags.map(commandFlag => commandFlag.length);
    const maxFlagLength = Math.max(...commandFlagLength);

    return commands
      .map(command => `${command.flag.padEnd(maxFlagLength)} — ${command.description};`)
      .join(LF);
  }

  getOutput(input) {
    const currentCommandFlag = getCurrentCommandFlag(input);
    const nonUtilityCommands = Object.entries(this.commandInfo)
      .filter(entry => !entry[1].isUtilityCommand)
      .reduce((commands, currentCommand) => ({
        ...commands,
        [currentCommand[0]]: currentCommand[1],
      }), {});
    const isCurrentCommandKnown = Object.values(nonUtilityCommands)
      .map(command => getCommandFlag(command.name))
      .includes(currentCommandFlag);
    const commandTypeConditions = {
      [COMMAND_TYPE_ABSENT]: !currentCommandFlag,
      [COMMAND_TYPE_UNKNOWN]: currentCommandFlag && !isCurrentCommandKnown,
      [COMMAND_TYPE_KNOWN]: currentCommandFlag && isCurrentCommandKnown,
    };
    const currentCommandType = Object.entries(commandTypeConditions)
      .filter(entry => entry[1])[0][0];
    const currentCommandName = isCurrentCommandKnown && getCommandName(currentCommandFlag);
    const currentCommandKey = currentCommandType === COMMAND_TYPE_KNOWN
      ? currentCommandName
      : currentCommandType;
    const currentCommandInfo = this.commandInfo[currentCommandKey];

    return {
      exitCode: currentCommandInfo.exitCode,
      message: currentCommandType === COMMAND_TYPE_UNKNOWN
        ? currentCommandInfo.message(currentCommandFlag)
        : currentCommandInfo.message(),
    };
  }

  logOutput(commandInfo) {
    console[commandInfo.exitCode === ERROR_CODE ? 'error' : 'log'](commandInfo.message);
    process.exit(commandInfo.exitCode);
  }
}

new Kekstagram(input);
