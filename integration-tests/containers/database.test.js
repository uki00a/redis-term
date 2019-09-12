import React from 'react';
import Database from '../../src/containers/database';
import {
  connectToRedis,
  cleanupRedisConnection,
  createStore,
  render,
  waitFor,
  waitForElementToBeHidden,
  waitForElementToBeRemoved,
  nextTick,
  createScreen,
  simulate,
  fireEvent,
  wait
} from '../helpers';
import assert from 'assert';
import fixtures from '../fixtures'

describe('<Database>', () => { 
  /** @type {import('../../src/modules/redis/facade').default} */
  let redis;
  let screen;

  async function setup() {
    redis = await connectToRedis();
    screen = createScreen();
  }

  async function cleanup() {
    await cleanupRedisConnection(redis);
    screen.destroy();
    redis = null;
    screen = null;
  }

  beforeEach(setup);
  afterEach(cleanup);

  it('should display keys when mounted', async () => {
    await redis.saveString('a', 'hoge');
    await redis.saveString('b', 'fuga');
    await redis.saveString('c', 'piyo');

    const { getBy } = renderSubject({ redis, screen });
    const keyList = await waitFor(() => getBy(isKeyList));


    assert.strictEqual(3, keyList.ritems.length);
    assert(keyList.ritems.includes('a'));
    assert(keyList.ritems.includes('b'));
    assert(keyList.ritems.includes('c'));
  });

  it('should delete a hovered key when "d" is pressed on a key list @unstable', async () => {
    await redis.saveString('a', 'hoge');
    await redis.saveString('b', 'fuga');
    await redis.saveString('c', 'piyo');

    const { getBy, getByContent } = renderSubject({ redis, screen });
    const keyList = await waitFor(() => getBy(isKeyList));

    assert.strictEqual(3, keyList.ritems.length);

    const elementToDelete = keyList.ritems[1];
    keyList.focus();
    simulate.select(keyList, 1);
    simulate.keypress(keyList, 'd');

    const okButton = getByContent(/OK/i);
    fireEvent.click(okButton);

    await wait(200); // FIXME

    // TODO add more assertions
    {
      const actual = keyList.ritems;
      const message = 'a hovered key should be removed from a key list';
      assert.strictEqual(2, actual.length, message);
      assert(!actual.includes(elementToDelete), message);
    }

    {
      const actual = await keys(redis);
      const message = 'a hovered key should be deleted from Redis';
      assert.strictEqual(actual.length, 2, message);
      assert(!actual.includes(elementToDelete), message);
    }
  });

  it('can add a new key to Redis when "a" is pressed on a key list', async () => {
    await redis.saveString('a', 'hoge');

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

    const actual = await keys(redis);
    const message = 'a new key should be added to Redis';
    assert.strictEqual(actual.length, 2, message);
    assert(actual.includes('a'), message);
    assert(actual.includes('b'), message);
  });

  function keys(redis) {
    return redis.getKeys();
  }

  function isKeyList(x) {
    return x.type === 'list' && x.ritems.length > 0;
  }

  function renderSubject({ redis, screen }) {
    const store = createStore({
      extraArgument: { redis }
    });
    const subject = render(
      <Database />,
      screen,
      { store }
    );
    return subject;
  }
});
