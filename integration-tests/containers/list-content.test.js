import React from 'react';
import ListContentContainer from '../../src/containers/list-content';
import {
  connectToRedis,
  cleanupRedisConnection,
  createStore,
  render,
  waitFor,
  waitForElementToBeHidden,
  simulate,
  nextTick,
  createScreen
} from '../helpers';
import assert from 'assert';
import fixtures from '../fixtures';

describe('<ListContentContainer>', () => {
  /** @type {import('../../src/modules/redis/facade').default} */
  let redis;
  let screen;

  beforeEach(setup);
  afterEach(cleanup);

  // FIXME This test sometimes fail...
  it('should update editing element when "C-s" is pressed on textarea', async () => {
    await setup();
    const keyName = fixtures.redisKey();
    const initialList = ['a', 'b', 'c'];
    await saveList(redis, keyName, initialList);

    const { getBy, getByType } = await renderSubject({ screen, keyName, redis });
    const textarea = getByType('textarea');
    const list = getByType('list');

    assert.deepEqual(list.ritems, initialList);

    simulate.select(list, 1);
    textarea.focus();

    await nextTick();
    assert.strictEqual(textarea.getValue(), 'b');
    textarea.setValue('hoge');
    simulate.keypress(textarea, 'C-s');
    await waitForElementToBeHidden(() => getBy(x => x.name === 'loader'));

    const expected = ['a', 'hoge', 'c'];
    assert.deepEqual(list.ritems, expected);
    assert.deepEqual(await redis.loadListElements(keyName), expected);
  });

  it('can add a new element to list when "a" is pressed on list', async () => {
    const keyName = fixtures.redisKey();
    const initialList = ['a', 'b'];
    await saveList(redis, keyName, initialList);

    const { getByType, getByContent, getBy } = await renderSubject({ screen, keyName, redis });
    const list = getByType('list');
    const newValue = 'c';

    assert.deepEqual(list.ritems, initialList);

    list.focus();
    await nextTick();

    list.emit('keypress', null, { name: 'a', full: 'a' });

    const textbox = getByType('textbox');
    const okButton = getByContent(/OK/);
    textbox.focus();
    await nextTick();
    textbox.setValue(newValue);
    okButton.emit('click');
    await waitForElementToBeHidden(() => getBy(x => x.name === 'loader'));

    const expected = ['c', ...initialList];
    assert.deepEqual(await redis.loadListElements(keyName), expected);
    assert.deepEqual(list.ritems, expected);
  });

  async function renderSubject({ screen, keyName, redis }) {
    const store = createStore({
      state: { keys: { selectedKeyName: keyName, selectedKeyType: 'list' } },
      extraArgument: { redis }
    });
    const subject = render(
      <ListContentContainer keyName={keyName} />,
      screen,
      { store }
    );
    await waitFor(() => subject.getByType('textarea'));
    return subject;
  }

  async function saveList(redis, key, values) {
    for (let i = values.length - 1; i > -1; --i) {
      await redis.addElementToList(key, values[i]);
    }
  }

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
});