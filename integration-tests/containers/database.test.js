import React from 'react';
import Database from '../../src/containers/database';
import {
  connectToRedis,
  cleanupRedisConnection,
  render,
  waitFor,
  waitForElementToBeHidden,
  waitForElementToBeRemoved,
  waitForItemsToBeChanged,
  nextTick,
  createScreen,
  simulate,
  fireEvent,
  wait,
  unmount
} from '../helpers';
import assert from 'assert';
import fixtures from '../fixtures'

describe('<Database>', () => { 
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
    screen = null;
  }

  beforeEach(setup);
  afterEach(cleanup);

  it('should display keys when mounted', async () => {
    await redis.set('a', 'hoge');
    await redis.set('b', 'fuga');
    await redis.set('c', 'piyo');

    const { getBy } = renderSubject({ redis, screen });
    const keyList = await waitFor(() => getBy(isKeyList));

    assert.strictEqual(3, keyList.ritems.length);
    assert(keyList.ritems.includes('a'));
    assert(keyList.ritems.includes('b'));
    assert(keyList.ritems.includes('c'));
  });

  it('should delete a hovered key when "d" is pressed on a key list', async () => {
    await redis.set('a', 'hoge');
    await redis.set('b', 'fuga');
    await redis.set('c', 'piyo');

    const { getBy, getByContent } = renderSubject({ redis, screen });
    const keyList = await waitFor(() => getBy(isKeyList));

    assert.strictEqual(3, keyList.ritems.length);

    const elementToDelete = keyList.ritems[1];
    keyList.focus();
    simulate.select(keyList, 1);
    simulate.keypress(keyList, 'd');

    const okButton = getByContent(/OK/i);
    fireEvent.click(okButton);

    await waitForItemsToBeChanged(keyList);

    // TODO add more assertions
    {
      const actual = keyList.ritems;
      const message = 'a hovered key should be removed from a key list';
      assert.strictEqual(2, actual.length, message);
      assert(!actual.includes(elementToDelete), message);
    }

    {
      const actual = await redis.keys('*');
      const message = 'a hovered key should be deleted from Redis';
      assert.strictEqual(actual.length, 2, message);
      assert(!actual.includes(elementToDelete), message);
    }
  });

  it('can add a new key to Redis when "a" is pressed on a key list', async () => {
    await redis.set('a', 'hoge');

    const { getBy, getByContent } = renderSubject({ redis, screen });
    const keyList = await waitFor(() => getBy(isKeyList));

    assert.strictEqual(1, keyList.ritems.length);
    assert(keyList.ritems.includes('a'));

    keyList.focus();
    simulate.keypress(keyList, 'a');

    await waitFor(() => getByContent(/OK/i))
    const keyNameInput = getBy(x => x.name === 'keyInput');
    const okButton = getByContent(/OK/i);

    keyNameInput.setValue('b');
    fireEvent.click(okButton);
    await waitForElementToBeRemoved(() => getBy(x => x.name === 'keyInput'));

    const actual = await redis.keys('*');
    const message = 'a new key should be added to Redis';
    assert.strictEqual(actual.length, 2, message);
    assert(actual.includes('a'), message);
    assert(actual.includes('b'), message);
  });

  function isKeyList(x) {
    return x.type === 'list' && x.ritems.length > 0;
  }

  function renderSubject({ redis, screen }) {
    const subject = render(
      <Database redis={redis} />,
      screen
    );
    return subject;
  }
});
