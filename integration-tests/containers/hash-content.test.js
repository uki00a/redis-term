import React from 'react';
import HashContentContainer from '../../src/containers/hash-content';
import {
  connectToRedis,
  cleanupRedisConnection,
  createStore,
  render,
  waitFor,
  nextTick,
  createScreen
} from '../helpers';
import assert from 'assert';
import faker from 'faker';

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
      const keyName = faker.random.word();
      const initialHash = {
        [faker.random.word()]: faker.random.word(),
        [faker.name.title()]: faker.name.title()
      };
      const fields = Object.keys(initialHash);
      await saveHashToRedis(keyName, initialHash);

      const { queryBy, getByType } = await renderSubject({ keyName });
      const textarea = getByType('textarea');
      const list = getByType('list');

      assert.strictEqual(list.ritems.length, 2);
      assert(fields.every(field => list.ritems.includes(field)));

      list.focus();
      await nextTick();

      list.select(1); 
      list.emit('keypress', null, { name: 'enter', full: 'enter' });
      textarea.focus();
      await nextTick();

      assert.strictEqual(textarea.getValue(), initialHash[list.ritems[1]]);
      const newValueOfSecondField = faker.address.city();
      textarea.setValue(newValueOfSecondField);
      textarea.emit('keypress', null, { full: 'C-s' });
      await waitFor(() => queryBy(x => x.name === 'loader') == null);

      const expected = { ...initialHash, [list.ritems[1]]: newValueOfSecondField };
      assert(fields.every(field => list.ritems.includes(field)))
      assert.deepEqual(await redis.getHashFields(keyName), expected);
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