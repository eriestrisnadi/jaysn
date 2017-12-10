import { fromJS } from 'immutable';

/**
 * Iterates over elements, returning an array of all elements
 * `predicate` returns truthy for. The predicate is invoked with the callback function.
 *
 * @since 0.1.0
 * @param {Function} predicate The callback function.
 * @returns {Array} Returns the new filtered array.
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
 * }).filter(o => o.get('age') === 36)
 * // => objects for ['barney']
 */
export function filter(predicate) {
  const storage = fromJS(this.data);

  return storage.get(this.keyName).filter(predicate) || [];
}

export default filter;
