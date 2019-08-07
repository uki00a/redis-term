import React from 'react';
import ListContentContainer from '../../src/containers/list-content';
import {
  connectToRedis,
  cleanupRedisConnection,
  createStore,
  render,
  waitForElement,
  nextTick,
  wait,
  createScreen
} from '../helpers';
import assert from 'assert';
import faker from 'faker';

describe('<ListContentContainer>', () => {
  context('when C-s pressed on textarea', () => {
    /** @type {import('../../src/modules/redis/facade').default} */
    let redis;
    let screen;

    before(async () => {
      redis = await connectToRedis();
      screen = createScreen();
    });

    after(async () => {
      await cleanupRedisConnection(redis);
      screen.destroy();
    });

    it('should update editing element', async () => {
      const keyName = faker.random.word();
      const initialList = [faker.random.word(), faker.random.word(), faker.random.word()];
      const [value1, value2, value3] = initialList;
      await saveList(keyName, initialList);

      const { getByType } = await renderSubject({ keyName });
      const textarea = getByType('textarea');
      const list = getByType('list');
      const newValue = faker.random.word();

      assert(textarea);
      assert(list)
      assert.deepEqual(list.ritems, initialList);

      list.select(1);
      list.emit('keypress', null, { name: 'enter', full: 'enter' });
      textarea.focus();

      await nextTick();
      assert.strictEqual(textarea.getValue(), value2);
      textarea.setValue(newValue);
      textarea.emit('keypress', null, { full: 'C-s' });
      await wait(100); // TODO wait for loader

      const expected = [value1, newValue, value3];
      assert.deepEqual(list.ritems, expected);
      assert.deepEqual(await redis.loadListElements(keyName), expected);
    });

    async function saveList(key, values) {
      for (let i = values.length - 1; i > -1; --i) {
        await redis.addElementToList(key, values[i]);
      }
    }

    async function renderSubject({ keyName }) {
      const store = createStore({
        state: { keys: { selectedKeyName: keyName, selectedKeyType: 'list' } },
        extraArgument: { redis }
      });
      const subject = render(
        <ListContentContainer keyName={keyName} />,
        screen,
        { store }
      );
      await waitForElement(() => subject.getByType('textarea'));
      return subject;
    }
  });
});