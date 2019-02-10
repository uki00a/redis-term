import React from 'react';
import StringContentContainer from '../../src/containers/string-content';
import Editor from '../../src/components/editor';
import {
  connectToRedis,
  cleanupRedisConnection,
  renderWithRedis,
  waitForElement,
  fireEvent,
  simulateInput
} from '../helpers';
import { RedisProvider } from '../../src/contexts/redis-context';
import assert from 'assert';

describe('<StringContentContainer>', () => {
  context('when save button clicked', () => {
    let redis;

    before(async () => {
      redis = await connectToRedis();
      await redis.set(TEST_KEY, INITIAL_VALUE_FOR_TEST_KEY);
      const subject = await renderSubject();
      const textarea = findTextarea(subject);
      const saveButton = findSaveButton(subject);
      simulateInput(textarea, NEW_VALUE_FOR_TEST_KEY);
      fireEvent.click(saveButton);
      await waitForMessageDialog(subject);
    });

    after(async () => {
      await cleanupRedisConnection(redis);
    });

    it('should save input value to redis', async () => {
      const expected = NEW_VALUE_FOR_TEST_KEY;
      const actual = await redis.get(TEST_KEY);
      assert.equal(actual, expected);
    });

    const TEST_KEY = 'test';
    const INITIAL_VALUE_FOR_TEST_KEY = 'hoge';
    const NEW_VALUE_FOR_TEST_KEY = 'piyo';

    const renderSubject = async () => {
      const subject = renderWithRedis(
        <StringContentContainer keyName={TEST_KEY} />,
        redis
      );
      await waitForElement(() => subject.getAllByType('textarea'));
      return subject;
    };
    const findTextarea = subject => subject.getAllByType('textarea')[0];
    const findSaveButton = subject => subject.getAllByContent(/Save/)[0];
    const waitForMessageDialog = subject => waitForElement(() => subject.getAllByContent(/Value was updated/));
  });
});
