import React from 'react';
import StringContentContainer from '../../src/containers/string-content';
import {
  connectToRedis,
  cleanupRedisConnection,
  createStore,
  render,
  waitForElement,
  fireEvent,
  simulateInput,
  nextTick,
  wait
} from '../helpers';
import assert from 'assert';
import faker from 'faker';

describe('<StringContentContainer>', () => {
  context('when C-s pressed', () => {
    /** @type {import('../../src/modules/redis/facade').default} */
    let redis;

    before(async () => {
      redis = await connectToRedis();
    });

    after(async () => {
      await cleanupRedisConnection(redis);
    });

    it('should save input value to redis', async () => {
      const keyName = faker.random.word();
      const initialValue = faker.random.word();
      await saveString(keyName, initialValue);

      const subject = await renderSubject({ keyName });
      const textarea = findTextarea(subject);

      assert.strictEqual(textarea.instance.getValue(), initialValue);

      fireEvent.focus(textarea);
      await nextTick();

      const newValue = faker.random.word();
      simulateInput(textarea, newValue);
      fireEvent.keypress(textarea, null, { full: 'C-s' });
      await wait(100); // TODO wait for loader

      const expected = newValue;
      const actual = await redis.loadString(keyName);
      assert.strictEqual(actual, expected);
    });

    const renderSubject = async ({ keyName }) => {
      const store = createStore({
        state: { keys: { selectedKeyName: keyName, selectedKeyType: 'string' } },
        extraArgument: { redis }
      });
      const subject = render(
        <StringContentContainer keyName={keyName} />,
        store
      );
      await waitForElement(() => subject.getAllByType('textarea'));
      return subject;
    };
    const findTextarea = subject => subject.getAllByType('textarea')[0];
    const saveString = (key, value) => redis.saveString(key, value);
  });
});
