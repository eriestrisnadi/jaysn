<pre><code class="javascript">
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
 */

    new Jaysn('users', {
        user: 'string',
        age: 'number',
        active: 'boolean'
    }).add({ user: "pebbles",  age: 1, active: true })

/**
 * // => objects for ['barney','fred','pebbles']
 */
</code></pre>