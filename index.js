#!/usr/bin/env node

require('module-alias/register');

const chalk = require('chalk');
const initProgram = require('#src/utils/init');

initProgram().then(() => {
  require('#src/utils/monitory');

  const programa = require('#src/main');

  const colunas = process.stdout.columns;

  console.log(chalk.bold(''.padStart(colunas, '*')));
  console.log(chalk.bold('BUSCA  CLI'.padStart(colunas / 2).padEnd(colunas)));
  console.log(chalk.bold(''.padStart(colunas, '*')));
  console.log();

  console.log(process.argv);
  programa.parse(process.argv, programa.opts());
});

process.on('exit', (code) => console.log(''));
