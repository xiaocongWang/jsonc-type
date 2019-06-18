#!/usr/bin/env node
import * as fs from 'fs';
import * as yargs from 'yargs';
import jsonc2Type from '../lib';
import * as path from 'path';

const argv = yargs.usage('jsonc-type [options]')
    .help('h')
    .alias('h', 'help')
    .demand('n')
    .nargs('n', 1)
    .alias('n', 'name')
    .describe('n', 'name of the interface')
    .demand('f')
    .nargs('f', 1)
    .alias('f', 'file')
    .describe('f', 'json file to transform')
    .option('o')
    .alias('o', 'output')
    .describe('o', 'output of the types file')
    .argv;

const file = argv.f;
const name = argv.n;
const output = argv.o;

fs.readFile(path.join(process.cwd(), file), (err, dataBuffer): void => {
    if (err) {
        throw err;
    }

    const str = jsonc2Type(name, dataBuffer.toString());

    if (output) {
        fs.writeFileSync(path.join(process.cwd(), output), str)
    } else {
        console.log(str)
    }
});