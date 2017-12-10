import { existsSync, writeFileSync, readFileSync } from 'fs';
import { struct } from 'superstruct';
import { cwd } from 'process';
import { join } from 'path';
import { add } from './add';
import { get } from './get';
import { find } from './find';
import { filter } from './filter';
import { remove } from './remove';
import { update } from './update';
import { hasOne, hasMany } from './relation';

export const JAYSN_PATH = join(cwd(), '.jaysn');

export function Jaysn(keyName, schema = {}) {
  if (!keyName) {
    throw new Error('keyName should be not null');
  }

  if (typeof keyName !== 'string') {
    throw new Error('keyName should be a string');
  }

  this.keyName = keyName;
  this.schema = Object.keys(schema).reduce((obj, key) => (
    { ...obj, [key]: struct.optional(schema[key]) }
  ), {});

  if (!existsSync(JAYSN_PATH)) {
    writeFileSync(JAYSN_PATH, JSON.stringify({}, null, 4), { encoding: 'utf8' });
  }

  this.storage = JSON.parse(readFileSync(JAYSN_PATH, 'utf8'));
  this.data = this.storage;
}

Jaysn.prototype.add = add;
Jaysn.prototype.get = get;
Jaysn.prototype.find = find;
Jaysn.prototype.filter = filter;
Jaysn.prototype.remove = remove;
Jaysn.prototype.update = update;
Jaysn.prototype.hasOne = hasOne;
Jaysn.prototype.hasMany = hasMany;

/**
 * Export.
 *
 * @type {Function}
 */

export default Jaysn;
