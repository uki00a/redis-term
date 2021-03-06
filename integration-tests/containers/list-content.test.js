import React from 'react';
import ListContentContainer from '../../src/containers/list-content';
import {
  connectToRedis,
  cleanupRedisConnection,
  render,
  waitFor,
  waitForElementToBeHidden,
  waitForItemsToBeChanged,
  simulate,
  nextTick,
  createScreen,
  unmount
} from '../helpers';
import assert from 'assert';
import fixtures from '../fixtures';

describe('<ListContentContainer>', () => {
  let redis;
  let screen;

  beforeEach(setup);
  afterEach(cleanup);

  it('should update editing element when "C-s" is pressed on textarea', async () => {
    await setup();
    const keyName = fixtures.redisKey();
    const initialList = ['a', 'b', 'c'];
    await saveList(redis, keyName, initialList);

    const { getBy, getByType } = await renderSubject({ screen, keyName, redis });
    const textarea = getByType('textarea');
    const list = getByType('list');
    await ensureItemsAreLoaded(list);

    assert.deepEqual(list.ritems, initialList, 'should load a list when mounted');

    simulate.select(list, 1);
    textarea.focus();

    await nextTick();
    assert.strictEqual(textarea.getValue(), 'b');
    textarea.setValue('hoge');
    simulate.keypress(textarea, 'C-s');
    await waitForItemsToBeChanged(list);

    const expected = ['a', 'hoge', 'c'];
    assert.deepEqual(list.ritems, expected);
    assert.deepEqual(await redis.lrange(keyName, 0, -1), expected);
  });

  it('can add a new element to list when "a" is pressed on list', async () => {
    const keyName = fixtures.redisKey();
    const initialList = ['a', 'b'];
    await saveList(redis, keyName, initialList);

    const { getByType, getByContent, getBy } = await renderSubject({ screen, keyName, redis });
    const list = getByType('list');
    const newValue = 'c';
    await ensureItemsAreLoaded(list);

    assert.deepEqual(list.ritems, initialList, 'should load a list when mounted');

    list.focus();
    await nextTick();

    simulate.keypress(list, 'a');

    const textbox = getByType('textbox');
    const okButton = getByContent(/OK/);
    textbox.focus();
    await nextTick();
    textbox.setValue(newValue);
    okButton.emit('click');
    await waitForItemsToBeChanged(list);

    const expected = ['c', ...initialList];
    assert.deepEqual(await redis.lrange(keyName, 0, -1), expected, 'a new element should be added to a list');
    assert.deepEqual(list.ritems, expected, 'a new element should be added to a list');
  });

  it('should reload a list when "C-r" is pressed on a list', async () => {
    const keyName = fixtures.redisKey();
    const initialList = ['a', 'b'];
    await saveList(redis, keyName, initialList);

    const {getByType} = await renderSubject({ screen, keyName, redis });
    const list = getByType('list');
    await ensureItemsAreLoaded(list);
    assert.deepEqual(list.ritems, initialList, 'should load a list when mounted');

    const newList = [...initialList, 'C'];
    await saveList(redis, keyName, newList);

    list.focus();
    simulate.keypress(list, 'C-r');

    await waitForItemsToBeChanged(list);
    {
      const list = getByType('list');
      assert.deepEqual(list.ritems, newList, 'should reload a list');
    }
  });

  async function ensureItemsAreLoaded(list) {
    if (list.ritems.length > 0) {
      return;
    }
    return waitForItemsToBeChanged(list);
  }

  async function renderSubject({ screen, keyName, redis }) {
    const subject = render(
      <ListContentContainer keyName={keyName} redis={redis} />,
      screen
    );
    await waitForElementToBeHidden(() => subject.getBy(x => x.name === 'loader'));
    return subject;
  }

  async function saveList(redis, key, values) {
    await redis.del(key);
    for (let i = values.length - 1; i > -1; --i) {
      await redis.lpush(key, values[i]);
    }
  }

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
});