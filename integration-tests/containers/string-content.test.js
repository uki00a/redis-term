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

describe('<StringContentContainer>', () => {
  context('when save button clicked', () => {
    /** @type {import('../../src/modules/redis/facade').default} */
    let redis;

    before(async () => {
      redis = await connectToRedis();
      await redis.saveString(TEST_KEY, INITIAL_VALUE_FOR_TEST_KEY);

      const subject = await renderSubject();
      const textarea = findTextarea(subject);
      fireEvent.focus(textarea);
      await nextTick();
      simulateInput(textarea, NEW_VALUE_FOR_TEST_KEY);
      fireEvent.keypress(textarea, null, { full: 'C-s' });
      await wait(100); // TODO wait for loader
    });

    after(async () => {
      await cleanupRedisConnection(redis);
    });

    it('should save input value to redis', async () => {
      const expected = NEW_VALUE_FOR_TEST_KEY;
      const actual = await redis.loadString(TEST_KEY);
      assert.equal(actual, expected);
    });

    const TEST_KEY = 'test';
    const INITIAL_VALUE_FOR_TEST_KEY = 'hoge';
    const NEW_VALUE_FOR_TEST_KEY = 'piyo';

    const renderSubject = async () => {
      const store = createStore({
        state: { keys: { selectedKeyName: TEST_KEY, selectedKeyType: 'string' } },
        extraArgument: { redis }
      });
      const subject = render(
        <StringContentContainer keyName={TEST_KEY} />,
        store
      );
      await waitForElement(() => subject.getAllByType('textarea'));
      return subject;
    };
    const findTextarea = subject => subject.getAllByType('textarea')[0];
  });
});
