import { fromJS, List } from 'immutable';

/**
 * Returning an array of all elements.
 *
 * @since 0.1.0
 * @returns {Array} Returns the array of all elements.
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
 * }).get()
 * // => objects for ['barney', 'fred', 'pebbles']
 */
export function get() {
  const storage = fromJS(this.data);
  const getData = List(storage.get(this.keyName) || []);

  return getData.toJS();
}

export default get;
