import { struct } from 'superstruct';
import { readFileSync, writeFileSync } from 'fs';
import { fromJS, Map, List } from 'immutable';
import { JAYSN_PATH } from './jaysn';

/**
 * Iterates over elements of, delete item and returning the new array of elements
 * `predicate` returns truthy for. The predicate is invoked with a callback function.
 *
 * @since 0.1.0
 * @param {Function} predicate The callback function.
 * @returns {Array} Returns the new array of elements.
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
 * }).remove(o => o.get('age') === 36)
 * // => objects for ['fred','pebbles']
 */
export function remove(predicate) {
    const storage = fromJS(this.data);
    const prevData = List(storage.get(this.keyName) || []);
    let currentData = storage;
    const id = prevData.findIndex(predicate);
    if(id >= 0){
        currentData = storage.set(this.keyName, prevData.delete(id));
        writeFileSync(JAYSN_PATH, JSON.stringify(
            currentData,
            null,
            4
        ), { encoding: 'utf8' });
    }
    
    return currentData.get(this.keyName).toJS();
}