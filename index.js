#!/usr/bin/env node

const programa = require('./src/pt-br/principal');

programa.parse(process.argv, programa.opts());
