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
import { cwd } from 'process';
import { join } from 'path';
import { fromJS } from 'immutable';
import { Jaysn, JAYSN_PATH } from '../dist/jaysn.es';
const userSchema = {
  id: 'number',
  title: 'string',
  is_published: 'boolean',
  tags: ['string'],
  author: {
    id: 'number',
  }
};
const postSchema = {
  id: 'number',
  title: 'string',
  user_id: 'number'
};
const userData = {
  id: 34,
  title: 'Hello World',
  tags: ['news', 'features'],
  author: {
    id: 1,
  }
};
const postData = {
  id: 30,
  title: 'Post User 34',
  user_id: 34
};
const postData2 = {
  id: 20,
  title: 'Post User 34 with id 20',
  user_id: 34
};

describe('new Jaysn()', () => {

  before(() => {
    if(existsSync(JAYSN_PATH)){
      unlinkSync(JAYSN_PATH);
    }
    
    new Jaysn('posts', postSchema)
    .add(postData);

    new Jaysn('posts', postSchema)
    .add(postData2);
  });

  describe('.add()', () => {

    it('should insert new item to the collection if validate true, else throw an `error`', () => {
      const result = fromJS(new Jaysn('users', userSchema)
      .add(userData)).equals(fromJS([userData]));

      assert.isTrue(result);
    });

  });

  describe('.get()', () => {

    it('should returns an array of collection', () => {
      const result = fromJS(new Jaysn('users', userSchema)
      .get()).equals(fromJS([userData]));

      assert.isTrue(result);
    });

  });

  describe('.find()', () => {

    it('should returns the matched element, else `undefined`.', () => {
      const result = fromJS(new Jaysn('users', userSchema)
      .find(o => o.get('id') === 34)).equals(fromJS(userData));

      assert.isTrue(result);
    });

  });

  describe('.filter()', () => {

    it('should returns the new filtered array.', () => {
      const result = fromJS(new Jaysn('users', userSchema)
      .filter(o => {
        return o.get('id') === 34
      })).equals(fromJS([userData]));
      
      assert.isTrue(result);
    });

  });

  describe('.hasOne()', () => {

    it('should re-create the jaysn with hasOne relation.', () => {
      const relation = fromJS(postData);
      const result = fromJS(new Jaysn('users', userSchema)
        .hasOne('posts', 'user_id', 'id')
        .find(o => o.get('id') === 34)
      ).equals(fromJS(userData).set('post', relation));

      assert.isTrue(result);
    });

  });

  describe('.hasMany()', () => {

    it('should re-create the jaysn with hasMany relation.', () => {
      const relation = fromJS([postData, postData2]);
      const result = fromJS(new Jaysn('users', userSchema)
        .hasMany('posts', 'user_id', 'id')
        .find(o => o.get('id') === 34)
      ).equals(fromJS(userData).set('posts', relation));

      assert.isTrue(result);
    });

  });

  describe('.update()', () => {

    it('should update an item and returns the updated item.', () => {
      const result = fromJS(new Jaysn('users', userSchema)
      .update({
        title: 'Hello Jaysn',
      }, o => {
        return o.get('id') === 34
      })).equals(fromJS(userData).set('title', 'Hello Jaysn'));

      assert.isTrue(result);
    });

  });

  describe('.remove()', () => {

    it('should delete an item and returns the new array without the deleted item.', () => {
      const result = fromJS(new Jaysn('users', userSchema)
      .remove(o => {
        return o.get('id') === 34
      })).equals(fromJS([userData]).delete(0));

      assert.isTrue(result);
    });

  });

});
