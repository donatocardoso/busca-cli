const { Command } = require('commander');
const packagejson = require('../../package.json');
const comandos = require('./comando');

const programa = new Command();

programa.name('busca-cli').usage('[comando]').addHelpCommand(false);

programa
  .helpOption('-a,   --ajuda', 'Exibi ajuda para usar o comando')
  .version(packagejson.version, '-v,   --versao', 'Exibi a versão atual');

for (const comando of comandos) programa.addCommand(comando());

module.exports = programa;
