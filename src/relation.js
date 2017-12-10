import { struct } from 'superstruct';
import { readFileSync } from 'fs';
import { fromJS, List } from 'immutable';
import { default as stemmer } from 'stemmer';
import { JAYSN_PATH } from './jaysn';

/**
 * Re-create the jaysn with hasOne relation.
 *
 * @since 0.1.0
 * @param {String} keyName Key name of the relation.
 * @param {String} foreignKey Identifier of foreign key.
 * @param {String} localKey Identifier of local key.
 * @returns {Function} Returns the new jaysn with hasOne relation.
 * @example
 *
 * .jaysn file
 * {
 *   "users": [
 *      { "user": "barney",  "age": 36, "active": true },
 *      { "user": "fred",  "age": 40, "active": false },
 *      { "user": "pebbles",  "age": 1, "active": true }
 *   ],
 *   "posts": [
 *      { "title": "barney's post",  "user_age": 36 },
 *      { "title": "fred's post",  "user_age": 40 },
 *      { "title": "pebbles's post",  "user_age": 1 }
 *   ]
 * }
 *
 * new Jaysn('users', {
 *   user: 'string',
 *   age: 'number',
 *   active: 'boolean'
 * }).hasOne('posts', 'user_age', 'age').get()
 * // => objects for [
 *      'barney with post: {barney's post}',
 *      'fred with post: {fred's post}',
 *      'pebbles with post: {pebbles's post}'
 *    ]
 */
export function hasOne(keyName, foreignKey, localKey) {
    if (
        typeof keyName != 'string' ||
        typeof foreignKey != 'string' ||
        typeof localKey != 'string'
    ) {
        throw new Error(`the predicate expected (keyName: string, foreignKey: string, localKey: string)`);
    }
    const storage = fromJS(this.data);
    const localData = List(storage.get(this.keyName) || []);
    const foreignData = List(storage.get(keyName) || []);
    const getData = localData.map(o => {
        return o.set(stemmer(keyName), foreignData.find(rel => {
            return rel.get(foreignKey) === o.get(localKey);
        }));
    });

    this.data = storage.set(this.keyName, getData).toJS();
    return this;
}

/**
 * Re-create the jaysn with hasMany relation.
 *
 * @since 0.1.0
 * @param {String} keyName Key name of the relation.
 * @param {String} foreignKey Identifier of foreign key.
 * @param {String} localKey Identifier of local key.
 * @returns {Function} Returns the new jaysn with hasMany relation.
 * @example
 *
 * .jaysn file
 * {
 *   "users": [
 *      { "user": "barney",  "age": 36, "active": true },
 *      { "user": "fred",  "age": 40, "active": false },
 *      { "user": "pebbles",  "age": 1, "active": true }
 *   ],
 *   "posts": [
 *      { "title": "barney's post",  "user_age": 36 },
 *      { "title": "fred's post",  "user_age": 40 },
 *      { "title": "pebbles's post",  "user_age": 1 }
 *   ]
 * }
 *
 * new Jaysn('users', {
 *   user: 'string',
 *   age: 'number',
 *   active: 'boolean'
 * }).hasMany('posts', 'user_age', 'age').get()
 * // => objects for [
 *      'barney with posts: [barney's post]',
 *      'fred with posts: [fred's post]',
 *      'pebbles with posts: [pebbles's post]'
 *    ]
 */
export function hasMany(keyName, foreignKey, localKey) {
    if (
        typeof keyName != 'string' ||
        typeof foreignKey != 'string' ||
        typeof localKey != 'string'
    ) {
        throw new Error(`the predicate expected (keyName: string, foreignKey: string, localKey: string)`);
    }
    const storage = fromJS(this.data);
    const localData = List(storage.get(this.keyName) || []);
    const foreignData = List(storage.get(keyName) || []);
    const getData = localData.map(o => {
        return o.set(keyName, foreignData.filter(rel => {
            return rel.get(foreignKey) === o.get(localKey);
        }) || []);
    });

    this.data = storage.set(this.keyName, getData).toJS();
    return this;
}