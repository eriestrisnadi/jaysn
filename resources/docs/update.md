<pre><code class="javascript">
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
 */

    new Jaysn('users', {
        user: 'string',
        age: 'number',
        active: 'boolean'
    }).update({
        user: 'bonbon'
    }, o => o.get('age') === 36)

/**
 * // => object for 'bonbon'
 */
</code></pre>