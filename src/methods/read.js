import { readFileSync } from 'fs';
import { JAYSN_PATH } from '../jaysn';
import { write } from './write';

export function read() {
    return JSON.parse(readFileSync(JAYSN_PATH, 'utf8'));
}