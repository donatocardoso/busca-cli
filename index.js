#!/usr/bin/env node

const program = require('./src/pt-br/principal');

program.parse(process.argv, program.opts());
