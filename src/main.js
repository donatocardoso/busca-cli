const { Command } = require('commander');
const packagejson = require('#root/package.json');
const { mainLanguages } = require('#src/utils/languages');
const commands = require('./commands');

const lang = mainLanguages();
const programa = new Command();

programa
  .name(lang.name)
  .usage(lang.usage)
  .addHelpCommand(false)
  .helpOption(lang.helpOption.flags, lang.helpOption.description)
  .version(packagejson.version, lang.versionOption.flags, lang.versionOption.description);

for (const command of commands) programa.addCommand(command());

module.exports = programa;
