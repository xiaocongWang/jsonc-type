import jsonc2Type from '../lib';
import * as fs from 'fs';

const rs = fs.createReadStream(__dirname + '/test.json', 'utf8');

rs.on('data', (chunk: string): void => {
    console.log(jsonc2Type('testInterface', chunk));
});

