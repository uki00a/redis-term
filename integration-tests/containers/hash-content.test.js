import React from 'react';
import HashContentContainer from '../../src/containers/hash-content';
import {
  connectToRedis,
  cleanupRedisConnection,
  createStore,
  render,
  waitFor,
  waitForElementToBeHidden,
  nextTick,
  createScreen
} from '../helpers';
import assert from 'assert';
import fixtures from '../fixtures'

describe('<HashContentContainer>', () => {
  /** @type {import('../../src/modules/redis/facade').default} */
  let redis;
  let screen;

  context('when C-s pressed on textarea', () => { 
    before(async () => {
      redis = await connectToRedis();
      screen = createScreen();
    });

    after(async () => {
      await cleanupRedisConnection(redis);
      screen.destroy();
    });

    it('should update editing field', async () => {
      const keyName = fixtures.redisKey();
      const initialHash = { 'a': 'hoge', 'b': 'fuga' };
      const fields = Object.keys(initialHash);
      await saveHashToRedis(keyName, initialHash);

      const { getBy, getByType } = await renderSubject({ keyName });
      const textarea = getByType('textarea');
      const fieldList = getByType('list');

      assert.strictEqual(fieldList.ritems.length, 2);
      assert(fields.every(field => fieldList.ritems.includes(field)));

      fieldList.focus();
      await nextTick();

      fieldList.select(1);
      fieldList.emit('keypress', null, { name: 'enter', full: 'enter' });
      textarea.focus();
      await nextTick();

      assert.strictEqual(textarea.getValue(), initialHash['b']);
      textarea.setValue('piyo');
      textarea.emit('keypress', null, { full: 'C-s' });
      await waitForElementToBeHidden(() => getBy(x => x.name === 'loader'));

      const expected = { 'a': 'hoge', 'b': 'piyo' };
      assert(fields.every(field => fieldList.ritems.includes(field)))
      assert.deepEqual(await redis.getHashFields(keyName), expected);
    });
  });

  context('when "d" key pressed on field list', () => {
    beforeEach(async () => {
      redis = await connectToRedis();
      screen = createScreen();
    });

    afterEach(async () => {
      await cleanupRedisConnection(redis);
      screen.destroy();
    });

    it('should delete a selected field', async () => {
      const keyName = fixtures.redisKey();
      const initialHash = { 'field': 'a', 'field_that_shoule_be_deleted': 'b' };
      await saveHashToRedis(keyName, initialHash);

      const { getByType, getByContent, getBy } = await renderSubject({ keyName });
      const fieldList = getByType('list');
      const initialFields = ['field', 'field_that_shoule_be_deleted'];

      assert(Object.keys(initialHash).every(field => initialFields.includes(field)));

      fieldList.focus();
      fieldList.select(1);
      fieldList.emit('keypress', null, { name: 'enter', full: 'enter' });
      fieldList.emit('keypress', null, { name: 'd', full: 'd' });

      const okButton = getByContent(/OK/i);
      okButton.emit('click');

      await waitForElementToBeHidden(() => getBy(x => x.name === 'loader'));

      const expected = { 'field': 'a' };
      assert.deepEqual(await redis.getHashFields(keyName), expected, 'selected field should be deleted from redis');
      assert.deepEqual(fieldList.ritems, [initialFields[0]]);
    });
  });

  describe('adding a new field to hash', () => {
    beforeEach(async () => {
      redis = await connectToRedis();
      screen = createScreen();
    });

    afterEach(async () => {
      await cleanupRedisConnection(redis);
      screen.destroy();
    });

    it('can add a new field to hash', async () => {
      const keyName = fixtures.redisKey();
      const initialHash = { 'field-1': 'hoge' };
      const initialFields = Object.keys(initialHash);
      await saveHashToRedis(keyName, initialHash);

      const { getBy, getByType, getByContent } = await renderSubject({ keyName });
      const fieldList = getByType('list');

      assert.strictEqual(fieldList.ritems.length, 1);
      assert(initialFields.every(field => fieldList.ritems.includes(field)));

      fieldList.focus();
      fieldList.emit('keypress', null, { name: 'a', full: 'a' });

      const keyInput = getBy(x => x.name === 'keyInput');
      const valueInput = getBy(x => x.name === 'valueInput');
      const okButton = getByContent(/OK/i);
      const newKey = 'field-2';
      const newValue = 'fuga';

      keyInput.setValue(newKey);
      valueInput.setValue(newValue);
      okButton.emit('click');
      await waitForElementToBeHidden(() => getBy(x => x.name === 'loader'));

      const expected = { 'field-1': 'hoge', 'field-2': 'fuga' };
      assert.deepEqual(await redis.getHashFields(keyName), expected, 'new field should be added');
      assert(Object.keys(expected).every(field => fieldList.ritems.includes(field)));
    });
  });

  async function renderSubject({ keyName }) {
    const store = createStore({
      state: { keys: { selectedKeyName: keyName, selectedKeyType: 'hash' } },
      extraArgument: { redis }
    });
    const subject = render(
      <HashContentContainer keyName={keyName} />,
      screen,
      { store }
    );
    await waitFor(() => subject.getByType('textarea'));
    return subject;
  }

  function saveHashToRedis(keyName, hash) {
    const promises = Object.keys(hash).map(field => {
      const value = hash[field];
      return redis.addFieldToHashIfNotExists(keyName, field, value);
    });
    return Promise.all(promises);
  }
});