# Jaysn
[![npm](https://img.shields.io/npm/v/jaysn.svg)](https://www.npmjs.org/package/jaysn) [![travisci](https://travis-ci.org/lowsprofile/jaysn.svg?branch=master)](https://travis-ci.org/lowsprofile/jaysn) [![donate](https://img.shields.io/badge/donate-patreon-red.svg)](https://www.patreon.com/bePatron?c=1404837)

Lightweight JSON database for Node, Hybrid, and Browser.  
Powered by Immutable and Superstruct.

## Getting Started
### Node / Hybrid
Install `jaysn` using node packager: yarn, or npm
```sh
# Install using yarn
yarn add jaysn

# Or, using npm
npm install jaysn --save
```
Then require it into any module
```js
const { jaysn } = require('jaysn');
const options = {use: 'File', source: 'db.json'};
const schema = {
  posts: {
    id: 'number',
    title: 'string',
  },
};
const db = jaysn(schema, options);
```

### Browser
A UMD build is also available on [unpkg](https://unpkg.com/) for testing and quick prototyping:
```html
<script src="https://unpkg.com/immutable@4.0.0-rc.9/dist/immutable.min.js"></script>
<script src="https://unpkg.com/superstruct@0.4.5/umd/superstruct.min.js"></script>
<script src="https://unpkg.com/jaysn@0.1.1/dist/jaysn.min.js"></script>
<script>
  var jaysn = Jaysn.jaysn;
  var options = {use: 'LocalStorage', source: 'MyDB'};
  var schema = {
    posts: {
      id: 'number',
      title: 'string',
    },
  };
  var db = jaysn(schema, options);
</script>
```

## Live Examples
- [RunKit example for Node/Hybrid](https://runkit.com/lowsprofile/5a3ff3aa22eb6c0011063af7)
- [JSFiddle example for Browser](https://jsfiddle.net/wdgyczx8/)

## API
### jaysn(schema, options?)
Returns an Immutable fromJS with additional properties and functions described below.

### db.write()
Writes database to file / local storage, and returns an Immutable of database state.
```js
db.set('posts', [])
  .write();
// Map { posts: List [ ... ] };
```

### db.getState()
Get current database state from file / local storage.
```js
db.getState();
// Map { posts: List [ ... ] };
```

## Quick Guides
Recommended to learn [Immutable API](https://facebook.github.io/immutable-js/docs/), so after that you can know how to query and manipulate data. Here are a few example to get you started.

### Examples
Set posts.
```js
db.set('posts', [])
  .write();
```

Get posts.
```js
db.get('posts');
```

Adding posts.
```js
const data = { id: 1, title: 'Hello Jaysn!'};
db.set('posts', db.get('posts').push(data))
  .write();
// Map { posts: List [ Map { id: 1, title: 'Hello Jaysn!' } ] }
```

## License
MIT License © 2017-Present **[lowsprofile](https://github.com/lowsprofile)**. All rights reserved.

## Legal
This is a free and open source app. Use it at your own risk.
