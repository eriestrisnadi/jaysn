import { struct } from 'superstruct';
import { writeFileSync } from 'fs';
import { fromJS, List, Map } from 'immutable';
import { JAYSN_PATH } from './jaysn';

/**
 * Append new item to elements
 * The `data` is invoked with the {Object} value.
 *
 * @since 0.1.0
 * @param {Object} data Value of an item to add.
 * @returns {*} Returns the new of current array, else throw an `error`.
 * @example
 *
 * .jaysn file
 * {
 *   "users": [
 *      { "user": "barney",  "age": 36, "active": true },
 *      { "user": "fred",  "age": 40, "active": false }
 *   ]
 * }
 *
 * new Jaysn('users', {
 *   user: 'string',
 *   age: 'number',
 *   active: 'boolean'
 * }).add({ user: "pebbles",  age: 1, active: true })
 * // => objects for ['barney','fred','pebbles']
 */
export function add(data) {
  const storage = fromJS(this.data);
  const prevData = List(storage.get(this.keyName) || []);
  const currentData = Map().set(this.keyName, prevData.concat(List([data])));
  const mergedData = storage.mergeDeep(currentData);
  const isDuplicate = fromJS(data).equals(prevData.find(o => fromJS(data).equals(o)));

  if (isDuplicate) {
    throw new Error('Value item shouldn\'t be same as existng, duplicate detected!');
  }

  try {
    struct(this.schema)(data);
    writeFileSync(JAYSN_PATH, JSON.stringify(mergedData, null, 4), { encoding: 'utf8' });
    return currentData.get(this.keyName).toJS();
  } catch (e) {
    const {
      message,
    } = e;
    throw new Error(message);
  }
}

export default add;
