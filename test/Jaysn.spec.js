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
import { Jaysn } from '../src/index';

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
    DB = new Jaysn(schema, opts);
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
      userData.id = '1';

      assert.throws(
        () => DB.set('users', userData).write(),
        TypeError,
        'Expected a value of type `number | undefined` for `id` but received `1`.'
      );
    });
  });

  describe('.merge(original, other).write()', () => {
    it('should change state when schema check is valid and equals with the inserted data', () => {
      userData.id = 1;
      postData.id = 1;
      userData.title = 'Hello Jaysn!';
      const origin = DB.getState();
      const other = fromJS({
        users: userData,
        posts: [postData],
      });

      DB.merge(origin, other).write();

      assert.isTrue(DB.getState().equals(other));
    });

    it('should not change state when schema check is invalid and db still the same as previous', () => {
      userData.id = 'Hello Jaysn!';
      const origin = DB.getState();
      const other = fromJS({
        users: userData,
        posts: [postData],
      });

      assert.throws(
        () => DB.merge(origin, other).write(),
        TypeError,
        'Expected a value of type `number | undefined` for `id` but received `Hello Jaysn!`.'
      );
    });
  });
});
