import React from 'react';
import HashContentContainer from '../../src/containers/hash-content';
import { plistToHash } from '../../src/modules/utils';
import {
  connectToRedis,
  cleanupRedisConnection,
  render,
  waitFor,
  waitForElementToBeHidden,
  nextTick,
  createScreen,
  simulate,
  fireEvent,
  unmount
} from '../helpers';
import assert from 'assert';
import fixtures from '../fixtures'

describe('<HashContentContainer>', () => {
  let redis;
  let screen;

  async function setup() {
    redis = await connectToRedis();
    screen = createScreen();
  }

  async function cleanup() {
    await cleanupRedisConnection(redis);
    unmount(screen);
    redis = null;
  }

  beforeEach(setup);
  afterEach(cleanup);

  it('can save editing field when C-s is pressed on textarea', async () => { 
    const keyName = fixtures.redisKey();
    const initialHash = { 'a': 'hoge', 'b': 'fuga' };
    const fields = Object.keys(initialHash);
    await saveHashToRedis(keyName, initialHash);

    const { getBy, getByType } = await renderSubject({ redis, screen, keyName });
    const textarea = getByType('textarea');
    const fieldList = getByType('list');

    assert.strictEqual(fieldList.ritems.length, 2);
    assert(fields.every(field => fieldList.ritems.includes(field)));

    fieldList.focus();
    await nextTick();

    simulate.select(fieldList, 1);
    textarea.focus();
    await nextTick();

    assert.strictEqual(textarea.getValue(), initialHash['b']);
    textarea.setValue('piyo');
    simulate.keypress(textarea, 'C-s');
    await waitForElementToBeHidden(() => getBy(x => x.name === 'loader'));

    const expected = { 'a': 'hoge', 'b': 'piyo' };
    assert(fields.every(field => fieldList.ritems.includes(field)))
    assert.deepEqual(await getHashFields(redis, keyName), expected);
  });

  it('should delete a selected field when "d" key is pressed on field list', async () => {
    const keyName = fixtures.redisKey();
    const initialHash = { 'field': 'a', 'field_that_shoule_be_deleted': 'b' };
    await saveHashToRedis(keyName, initialHash);

    const { getByType, getByContent, getBy } = await renderSubject({ redis, screen, keyName });
    const fieldList = getByType('list');
    const initialFields = ['field', 'field_that_shoule_be_deleted'];

    assert(Object.keys(initialHash).every(field => initialFields.includes(field)));

    fieldList.focus();
    simulate.select(fieldList, 1);
    simulate.keypress(fieldList, 'd');

    const okButton = getByContent(/OK/i);
    fireEvent.click(okButton);

    await waitForElementToBeHidden(() => getBy(x => x.name === 'loader'));

    const expected = { 'field': 'a' };
    assert.deepEqual(await getHashFields(redis, keyName), expected, 'selected field should be deleted from redis');
    assert.deepEqual(fieldList.ritems, [initialFields[0]]);
  });

  it('can add a new field to hash', async () => {
    const keyName = fixtures.redisKey();
    const initialHash = { 'field-1': 'hoge' };
    const initialFields = Object.keys(initialHash);
    await saveHashToRedis(keyName, initialHash);

    const { getBy, getByType, getByContent } = await renderSubject({ keyName, redis, screen });
    const fieldList = getByType('list');

    assert.strictEqual(fieldList.ritems.length, 1);
    assert(initialFields.every(field => fieldList.ritems.includes(field)));

    fieldList.focus();
    simulate.keypress(fieldList,  'a');

    const keyInput = getBy(x => x.name === 'keyInput');
    const valueInput = getBy(x => x.name === 'valueInput');
    const okButton = getByContent(/OK/i);
    const newKey = 'field-2';
    const newValue = 'fuga';

    keyInput.setValue(newKey);
    valueInput.setValue(newValue);
    fireEvent.click(okButton);
    await waitForElementToBeHidden(() => getBy(x => x.name === 'loader'));

    const expected = { 'field-1': 'hoge', 'field-2': 'fuga' };
    assert.deepEqual(await getHashFields(redis, keyName), expected, 'new field should be added');
    assert(Object.keys(expected).every(field => fieldList.ritems.includes(field)));
  });

  it('should realod a hash value when "C-r" is pressed on a field list', async () => {
    const keyName = fixtures.redisKey();
    const initialHash = { 'a': 'hoge' };
    const initialFields = ['a'];
    await saveHashToRedis(keyName, initialHash);

    const { getByType } = await renderSubject({ keyName, redis, screen });
    const fieldList = getByType('list');

    assert.strictEqual(fieldList.ritems.length, 1, 'a hash value should be loaded when mounted');
    assert(fieldList.ritems.every(field => initialFields.includes(field)), 'a hash value should be loaded when mounted');

    await redis.hset(keyName, 'b', 'fuga');

    fieldList.focus();
    simulate.keypress(fieldList, 'C-r');

    await waitFor(() => getByType('list'))
    {
      const fieldList = getByType('list');
      const expectedFields = [...initialFields, 'b'];
      assert.strictEqual(2, fieldList.ritems.length, 'a hash value should be reloaded');
      assert(fieldList.ritems.every(field => expectedFields.includes(field)), 'a hash value should be reloaded');
    }
  });

  async function renderSubject({ redis, screen, keyName }) {
    const subject = render(
      <HashContentContainer keyName={keyName} redis={redis} />,
      screen
    );
    await waitFor(() => subject.getByType('textarea'));
    return subject;
  }

  function saveHashToRedis(keyName, hash) {
    const promises = Object.keys(hash).map(field => {
      const value = hash[field];
      return redis.hset(keyName, field, value);
    });
    return Promise.all(promises);
  }

  async function getHashFields(redis, keyName) {
    const cursor = 0;
    const count = 1000;
    const [_, result] = await redis.hscan( // eslint-disable-line no-unused-vars
      keyName, 
      cursor,
      'MATCH',
      '*',
      'COUNT',
      count
    );
    return plistToHash(result);
  }
});