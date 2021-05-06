const { Command } = require('commander');
const packagejson = require('#root/package.json');
const commands = require('./commands');

const programa = new Command();

programa.name('busca-cli').usage('[comando]').addHelpCommand(false);

programa
  .helpOption('-a,   --ajuda', 'Exibi ajuda para usar o comando')
  .version(packagejson.version, '-v,   --versao', 'Exibi a versão atual');

for (const command of commands) programa.addCommand(command());

module.exports = programa;
