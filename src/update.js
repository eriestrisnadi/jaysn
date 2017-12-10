import { struct } from 'superstruct';
import { readFileSync, writeFileSync } from 'fs';
import { fromJS, Map, List } from 'immutable';
import { JAYSN_PATH } from './jaysn';

/**
 * Iterates over elements of, update an item and returning the updated item, else undefined
 * `predicate` returns truthy for. The `predicate` is invoked with a callback function
 * and `data` is invoked with the {Object} value.
 *
 * @since 0.1.0
 * @param {Object} data Value of an item to update.
 * @param {Function} predicate The callback function.
 * @returns {*} Returns the updated item, else undefined.
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
 * }).update({
 *   user: 'bonbon'
 * }, o => o.get('age') === 36)
 * // => object for 'bonbon'
 */
export function update(data, predicate) {
    const storage = fromJS(this.storage);
    const prevData = List(storage.get(this.keyName) || []);
    let currentData = storage;
    const id = prevData.findIndex(predicate);
    if(id >= 0){
        currentData = storage.set(this.keyName, prevData.set(id, prevData.get(id).mergeDeep(data)));
    }

    try {
        const Struct = struct(this.schema)(data);
        writeFileSync(JAYSN_PATH, JSON.stringify(
            currentData,
            null,
            4
        ), { encoding: 'utf8' });
    } catch (e) {
        const { message, path, data, type, value } = e;
        throw new Error(message);
    }
    
    return currentData.get(this.keyName).find(predicate).toJS() || undefined;
}