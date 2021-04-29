#!/usr/bin/env node

const { Command } = require('commander');
const packagejson = require('./package.json');

const program = new Command();

program
  .name('search-cli')
  .usage('[options] <workdir> <text>')
  .helpOption('-h, --help', 'exibi ajuda para o comando')
  .version(packagejson.version, '-v, --version', 'exibi a versão atual')
  .addHelpText('after', '\nExample call: \n   $ search-cli ./example "walt disney"');

program
  .arguments('[workdir] [text]')
  .description('Busca arquivos no diretorio desejado que possuem o texto informado')
  .action((workdir, text) => {
    console.log(workdir, text);
  });

program.parse(process.argv, program.opts());
