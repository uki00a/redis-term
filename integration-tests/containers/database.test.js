import React from 'react';
import Database from '../../src/containers/database';
import {
  connectToRedis,
  cleanupRedisConnection,
  createStore,
  render,
  waitFor,
  waitForElementToBeHidden,
  nextTick,
  createScreen,
  simulate,
  fireEvent
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
    const keyList = await waitFor(() => getBy(x => x.type === 'list' && x.ritems.length > 0));


    assert.strictEqual(3, keyList.ritems.length);
    assert(keyList.ritems.includes('a'));
    assert(keyList.ritems.includes('b'));
    assert(keyList.ritems.includes('c'));
  });

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
