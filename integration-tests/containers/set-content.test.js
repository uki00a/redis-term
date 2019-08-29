import React from 'react';
import SetContentContainer from '../../src/containers/set-content';
import {
  connectToRedis,
  cleanupRedisConnection,
  createStore,
  render,
  waitFor,
  waitForElementToBeHidden,
  createScreen,
  simulate,
  fireEvent
} from '../helpers';
import assert from 'assert';
import fixtures from '../fixtures';

describe('<SetContentContainer>', () => {
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

  it('can add a new member to a set when "a" key is pressed on member list', async () => {
    const keyName = fixtures.redisKey();
    const initialSet = ['hoge', 'fuga'];
    await saveSetToRedis(keyName, initialSet);

    const { getByType, getByContent, getBy } = await renderSubject({ redis, screen, keyName });
    const memberList = getByType('list');

    assert.strictEqual(2, memberList.ritems.length);
    assert(initialSet.every(x => memberList.ritems.includes(x)));

    memberList.focus();
    simulate.keypress(memberList, 'a');

    const memberInput = getByType('textbox');
    const okButton = getByContent(/OK/i);
    const newMember = 'piyo';

    memberInput.setValue(newMember);
    fireEvent.click(okButton);
    await waitForElementToBeHidden(() => getBy(x => x.name === 'loader'));

    const expected = initialSet.concat(newMember);
    const actual = await redis.getSetMembers(keyName);
    assert.strictEqual(3, actual.length);
    assert(expected.every(x => actual.includes(x)));
    assert.strictEqual(3, memberList.ritems.length);
    assert(expected.every(x => memberList.ritems.includes(x)));
  });

  async function renderSubject({ redis, screen, keyName }) {
    const store = createStore({
      state: { keys: { selectedKeyName: keyName, selectedKeyType: 'set' } },
      extraArgument: { redis }
    });
    const subject = render(
      <SetContentContainer keyName={keyName} />,
      screen,
      { store }
    );
    await waitFor(() => subject.getByType('list'));
    return subject;
  }

  async function saveSetToRedis(keyName, set) {
    for (const x of set) {
      await redis.addMemberToSet(keyName, x);
    }
  }
});