const { Command } = require('commander');
const fs = require('fs');
const path = require('path');
const env = require('#src/config/env.json');
const { showMessage } = require('#src/utils/message');
const languages = require('./languages');

const lang = languages();

/**
 * Create command `environment`
 */
module.exports = () => {
  const environment = new Command(lang.name)
    .usage(lang.usage)
    .description(lang.description)
    .addHelpCommand(false)
    .helpOption(lang.helpOption.flags, lang.helpOption.description)
    .addHelpText('afterAll', ' ')
    .addHelpText('afterAll', `${lang.addHelpText.title}`)
    .addHelpText('afterAll', ' ')
    .addHelpText('afterAll', `$ ${lang.command} ${lang.name}`)
    .addHelpText('afterAll', `$ ${lang.command} ${lang.name} ${lang.listCommand.name}`)
    .addHelpText('afterAll', `$ ${lang.command} ${lang.name} ${lang.getCommand.name} ${lang.getCommand.argumentsText}`)
    .addHelpText('afterAll', `$ ${lang.command} ${lang.name} ${lang.setCommand.name} ${lang.setCommand.argumentsText}`)
    .action(listCommand);

  environment.addCommand(
    new Command(lang.listCommand.name)
      .description(lang.listCommand.description)
      .helpOption(lang.helpOption.flags, lang.helpOption.description)
      .action(listCommand)
  );

  environment.addCommand(
    new Command(lang.getCommand.name)
      .arguments(lang.getCommand.argumentsText)
      .description(lang.getCommand.description, lang.getCommand.arguments)
      .helpOption(lang.helpOption.flags, lang.helpOption.description)
      .action(getCommand)
  );

  environment.addCommand(
    new Command(lang.setCommand.name)
      .arguments(lang.setCommand.argumentsText)
      .description(lang.setCommand.description, lang.setCommand.arguments)
      .helpOption(lang.helpOption.flags, lang.helpOption.description)
      .addHelpText('after', ' ')
      .addHelpText('after', lang.notes.title)
      .addHelpText('after', lang.notes.text)
      .action(setCommand)
  );

  return environment;
};

/**
 * Create command `environment list`
 */
function listCommand() {
  const props = Object.getOwnPropertyNames(env);

  showMessage(...lang.listCommand.successMessage(), '', ...props.map((prop) => `${prop}=${env[prop]}`));

  /* istanbul ignore next */
  if (process.env.NODE_ENV !== 'test') process.exit();
}

/**
 * Create command `environment get`
 * @param {string} prop Environment property name
 */
function getCommand(prop) {
  showMessage(...(env[prop] ? lang.getCommand.successMessage(prop, env[prop]) : lang.getCommand.errorMessage(prop)));

  /* istanbul ignore next */
  if (process.env.NODE_ENV !== 'test') process.exit();
}

/**
 * Create command `environment set`
 * @param {string} prop Environment property name
 * @param {string} value Environment property value
 */
function setCommand(prop, value) {
  if (!env[prop]) return showMessage(...lang.setCommand.errorMessage(prop));

  if (prop === 'LANGUAGE' && !['pt-BR', 'en-US'].includes(value))
    return showMessage(...lang.setCommand.unavailableLanguage(value));

  env[prop] = value;

  fs.writeFileSync(path.resolve(__dirname, '../../config/env.json'), JSON.stringify(env));

  showMessage(...lang.setCommand.successMessage(prop));

  listCommand();

  /* istanbul ignore next */
  if (process.env.NODE_ENV !== 'test') process.exit();
}
