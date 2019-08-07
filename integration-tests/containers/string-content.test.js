import React from 'react';
import StringContentContainer from '../../src/containers/string-content';
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

describe('<StringContentContainer>', () => {
  context('when C-s pressed', () => {
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

    it('should save input value to redis', async () => {
      const keyName = faker.random.word();
      const initialValue = faker.random.word();
      await saveString(keyName, initialValue);

      const {getByType} = await renderSubject({ keyName });
      const textarea = getByType('textarea');

      assert.strictEqual(textarea.getValue(), initialValue);

      textarea.focus();
      await nextTick();

      const newValue = faker.random.word();
      textarea.setValue(newValue);
      textarea.emit('keypress', null, { full: 'C-s' });
      await wait(100); // TODO wait for loader

      const expected = newValue;
      const actual = await redis.loadString(keyName);
      assert.strictEqual(actual, expected);
      assert.strictEqual(textarea.getValue(), expected);
    });

    const renderSubject = async ({ keyName }) => {
      const store = createStore({
        state: { keys: { selectedKeyName: keyName, selectedKeyType: 'string' } },
        extraArgument: { redis }
      });
      const subject = render(
        <StringContentContainer keyName={keyName} />,
        screen,
        { store }
      );
      await waitForElement(() => subject.getByType('textarea'));
      return subject;
    };
    const saveString = (key, value) => redis.saveString(key, value);
  });
});
