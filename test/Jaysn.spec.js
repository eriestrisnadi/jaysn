/**
 * Jaysn (https://lowsprofile.github.io/jaysn)
 *
 * Copyright © 2017-Present Eries Trisnadi. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { assert } from 'chai';
import { existsSync, unlinkSync } from 'fs';
import { fromJS } from 'immutable';
import { jaysn } from '../src/Jaysn';

const opts = {
  source: 'db.json',
};

const schema = {
  users: {
    id: 'number',
    title: 'string',
    is_published: 'boolean',
    tags: ['string'],
    author: {
      id: 'number',
    },
  },
  posts: {
    id: 'number',
    title: 'string',
    user_id: 'number',
  },
};
const userData = {
  id: 1,
  title: 'Hello World',
  tags: ['news', 'features'],
  author: {
    id: 1,
  },
};
const postData = {
  id: 1,
  title: 'Post User 34',
  user_id: 34,
};

let DB;

describe('new Jaysn()', () => {
  before(() => {
    if (existsSync(opts.source)) {
      unlinkSync(opts.source);
    }
    DB = jaysn(schema, opts);
  });

  describe('.set(key, data).write()', () => {
    it('should change state when schema check is valid and equals with the inserted data', () => {
      DB.set('users', userData).write();
      DB.set('posts', [postData]).write();

      DB.set('posts', DB.get('posts').push(postData)).write();

      assert.isTrue(DB.get('users').equals(fromJS(userData)));
      assert.isTrue(DB.get('posts').equals(fromJS([postData, postData])));
    });

    it('should not change state when schema check is invalid and db still the same as previous', () => {
      const data = Object.assign({}, userData);
      data.id = '1';

      assert.throws(
        () => DB.set('users', data).write(),
        TypeError,
        'Expected a value of type `number | undefined` for `id` but received `"1"`.'
      );
    });
  });

  describe('.get(key).find(predicate)', () => {
    it('should change state when schema check is valid and equals with the inserted data', () => {
      assert.isTrue(DB.get('posts').find(o => o.get('id') === 1).equals(fromJS(postData)));
    });
  });

  describe('.get(key).delete(index)', () => {
    it('should change state when schema check is valid and equals without the deleted data', () => {
      const index = DB.get('posts').findIndex(o => o.get('id') === 1);
      DB.deleteIn(['posts', index]).write();
      assert.isTrue(DB.get('posts').equals(fromJS([postData])));
    });
  });

  describe('.update(key, predicate).write()', () => {
    it('should change state when schema check is valid and equals with the updated data', () => {
      DB
        .update('users', o => o.set('title', 'Hi Jaysn!'))
        .write();
      DB.update('posts', o => o.push(postData)).write();

      assert.isTrue(DB.get('users').equals(fromJS(userData).set('title', 'Hi Jaysn!')));
      assert.isTrue(DB.get('posts').equals(fromJS([postData, postData])));
    });

    it('should not change state when schema check is invalid and db still the same as previous', () => {
      assert.throws(
        () => DB.update('users', o => o.set('id', '1')).write(),
        TypeError,
        'Expected a value of type `number | undefined` for `id` but received `"1"`.'
      );
    });
  });

  describe('.merge(original, other).write()', () => {
    it('should change state when schema check is valid and equals with the inserted data', () => {
      const userMod = Object.assign({}, userData);
      const postMod = Object.assign({}, postData);
      postMod.id = userMod.id = 1;
      userMod.title = 'Hello Jaysn!';
      const origin = DB.getState();
      const other = fromJS({
        users: userMod,
        posts: [postMod],
      });

      DB.merge(origin, other).write();

      assert.isTrue(DB.getState().equals(other));
    });

    it('should not change state when schema check is invalid and db still the same as previous', () => {
      const userMod = Object.assign({}, userData);
      userMod.id = 'Hello Jaysn!';
      const origin = DB.getState();
      const other = fromJS({
        users: userMod,
        posts: [postData],
      });

      assert.throws(
        () => DB.merge(origin, other).write(),
        TypeError,
        'Expected a value of type `number | undefined` for `id` but received `"Hello Jaysn!"`.'
      );
    });
  });
});
