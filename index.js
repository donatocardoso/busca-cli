#!/usr/bin/env node
require('./src/utils/monitory');

const chalk = require('chalk');
const programa = require('./src/pt-br/principal');

const colunas = process.stdout.columns;

console.log(chalk.bold(''.padStart(colunas, '*')));
console.log(chalk.bold('BUSCA  CLI'.padStart(colunas / 2).padEnd(colunas)));
console.log(chalk.bold(''.padStart(colunas, '*')));
console.log();

programa.parse(process.argv, programa.opts());

process.on('exit', () => console.log());
