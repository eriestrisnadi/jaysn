import { struct } from 'superstruct';
import { readFileSync, writeFileSync } from 'fs';
import { fromJS, Map } from 'immutable';
import { JAYSN_PATH } from './jaysn';

/**
 * Iterates over elements of, returning the first element
 * `predicate` returns truthy for. The predicate is invoked with a callback function.
 *
 * @since 0.1.0
 * @param {Function} predicate The callback function.
 * @returns {*} Returns the matched element, else `undefined`.
 * @example
 *
 * .jaysn file
 * {
 *   "users": [
 *      { "user": "barney",  "age": 36, "active": true },
 *      { "user": "fred",  "age": 40, "active": false },
 *      { "user": "pebbles",  "age": 1, "active": true }
 *   ]
 * }
 *
 * new Jaysn('users', {
 *   user: 'string',
 *   age: 'number',
 *   active: 'boolean'
 * }).find(o => o.get('age') === 36)
 * // => object for 'barney'
 */
export function find(predicate) {
    const storage = fromJS(this.data);
    
    return storage.get(this.keyName).find(predicate).toJS() || undefined;
}