import React from 'react';
import StringContentContainer from '../../src/containers/string-content';
import {
  connectToRedis,
  cleanupRedisConnection,
  createStore,
  render,
  waitFor,
  nextTick,
  createScreen,
  simulate,
  waitForElementToBeHidden
} from '../helpers';
import assert from 'assert';
import fixtures from '../fixtures';

describe('<StringContentContainer>', () => {
  /** @type {import('../../src/modules/redis/facade').default} */
  let redis;
  let screen;

  afterEach(async () => {
    await cleanupRedisConnection(redis);
    screen.destroy();
  });

  it('should save input value to redis when "C-s" pressed on textarea', async () => {
    redis = await connectToRedis();
    screen = createScreen();

    const keyName = fixtures.redisKey();
    const initialValue = fixtures.string();
    await saveString(keyName, initialValue);

    const {getByType, getBy} = await renderSubject({
      keyName,
      redis,
      screen
    });
    const textarea = getByType('textarea');

    assert.strictEqual(textarea.getValue(), initialValue);

    textarea.focus();
    await nextTick();

    const newValue = fixtures.string();
    textarea.setValue(newValue);
    simulate.keypress(textarea, 'C-s');
    await waitForElementToBeHidden(() => getBy(x => x.name === 'loader'));

    const expected = newValue;
    const actual = await redis.loadString(keyName);
    assert.strictEqual(actual, expected);
    assert.strictEqual(textarea.getValue(), expected);
  });

  const renderSubject = async ({ redis, screen, keyName }) => {
    const store = createStore({
      state: { keys: { selectedKeyName: keyName, selectedKeyType: 'string' } },
      extraArgument: { redis }
    });
    const subject = render(
      <StringContentContainer keyName={keyName} />,
      screen,
      { store }
    );
    await waitFor(() => subject.getByType('textarea'));
    return subject;
  };
  const saveString = (key, value) => redis.saveString(key, value);
});
