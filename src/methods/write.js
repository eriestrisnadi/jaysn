import { writeFileSync } from 'fs';
import { isImmutable, fromJS } from 'immutable';
import { JAYSN_PATH } from '../jaysn';
import { read } from './read';

export function write(data) {
    writeFileSync(JAYSN_PATH, JSON.stringify(data, null, 4), { encoding: 'utf8' });

    return read();
}

export default write;
