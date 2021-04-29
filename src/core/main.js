const { Command, Option } = require('commander');
const shell = require('shelljs');
const packagejson = require('../../package.json');
const commands = require('../commands');

const program = new Command();

program
  .name('search-cli')
  .usage('[options] <workdir> <text>')
  .helpOption('-h,   --help', 'exibi ajuda para usar o comando')
  .version(packagejson.version, '-v,   --version', 'exibi a versão atual')
  .addHelpText('after', '\nExample call: \n   $ search-cli ./example "walt disney"');

program
  .addOption(new Option('-e,   --exact', 'busca pela sentença exata informada'))
  .addOption(new Option('-c,   --case-sensitive', 'busca pela sentença exata informada'))
  .addOption(new Option('-wd,  --with-details', 'retorna detalhes dos arquivos encontrados'));

for (const command of commands) {
  program
    .arguments(command.arguments)
    .description(...command.description)
    .action(command.action);
}

program.exec = shell.exec;

module.exports = program;
