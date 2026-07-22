import { readFileSync, writeFileSync } from 'node:fs';

const target = process.argv[2];
if (!target) throw new Error('Expected a generated file path.');

const source = readFileSync(target, 'utf8');
writeFileSync(target, source.replace(/[\t ]+$/gm, '').replace(/^ +(?=\t)/gm, ''), 'utf8');
