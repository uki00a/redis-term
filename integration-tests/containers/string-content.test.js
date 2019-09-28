import React from 'react';
import StringContentContainer from '../../src/containers/string-content';
import {
  connectToRedis,
  cleanupRedisConnection,
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
  let redis;
  let screen;

  beforeEach(async () => {
    redis = await connectToRedis();
    screen = createScreen();
  });

  afterEach(async () => {
    await cleanupRedisConnection(redis);
    screen.destroy();
  });

  it('should save input value to redis when "C-s" pressed on textarea', async () => {
    const keyName = fixtures.redisKey();
    const initialValue = fixtures.string();
    await redis.set(keyName, initialValue);

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
    const actual = await redis.get(keyName);
    assert.strictEqual(actual, expected);
    assert.strictEqual(textarea.getValue(), expected);
  });

  it('should reload value when "C-r" is pressed on textarea', async () => {
    const keyName = fixtures.redisKey();
    const initialValue = 'hoge';
    await redis.set(keyName, initialValue);

    const {getByType, getBy} = await renderSubject({
      keyName,
      redis,
      screen
    });

    assert.strictEqual(getByType('textarea').getValue(), initialValue);

    const newValue = 'fuga';
    await redis.set(keyName, newValue);

    const textarea = getByType('textarea');
    textarea.focus();
    simulate.keypress(textarea, 'C-r');
    await waitFor(() => getByType('textarea'));

    assert.strictEqual(getByType('textarea').getValue(), newValue);
  });

  const renderSubject = async ({ redis, screen, keyName }) => {
    const subject = render(
      <StringContentContainer redis={redis} keyName={keyName} />,
      screen
    );
    await waitFor(() => subject.getByType('textarea'));
    return subject;
  };
});
