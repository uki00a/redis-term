import React from 'react';
import ZsetContentContainer from '../../src/containers/zset-content';
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

describe('<ZsetContentContainer>', () => { 
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

  it('can add a new member to a zset when "a" key is pressed on member list', async () => {
    const keyName = fixtures.redisKey();
    const initialZset = [['hoge', '1'], ['fuga', '2']];
    await saveZsetToRedis(keyName, initialZset);

    const { getByType, getByContent, getBy } = await renderSubject({ redis, screen, keyName });
    const memberList = getByType('list');

    assert.strictEqual(2, memberList.ritems.length);
    assert(initialZset.every(([x]) => memberList.ritems.includes(x)));

    memberList.focus();
    simulate.keypress(memberList, 'a');

    const valueInput = getBy(x => x.name === 'valueInput');
    const scoreInput = getBy(x => x.name === 'scoreInput');
    const okButton = getByContent(/OK/i);
    const newMember = 'piyo';
    const newScore = '3';

    valueInput.setValue(newMember);
    scoreInput.setValue(newScore);
    fireEvent.click(okButton);
    await waitForElementToBeHidden(() => getBy(x => x.name === 'loader'));

    const expectedMembers = ['hoge', 'fuga', 'piyo'];
    const expectedScores = ['1', '2', '3'];
    const [actualMembers, actualScores] = await redis.getZsetMembers(keyName);

    assert.strictEqual(3, actualMembers.length);
    assert(expectedMembers.every(x => actualMembers.includes(x)));

    assert.strictEqual(3, actualScores.length);
    assert(expectedScores.every(x => actualScores.includes(x)));

    assert.strictEqual(3, memberList.ritems.length);
    assert(expectedMembers.every(x => memberList.ritems.includes(x)));
  });

  async function renderSubject({ redis, screen, keyName }) {
    const store = createStore({
      state: { keys: { selectedKeyName: keyName, selectedKeyType: 'zset' } },
      extraArgument: { redis }
    });
    const subject = render(
      <ZsetContentContainer keyName={keyName} />,
      screen,
      { store }
    );
    await waitFor(() => subject.getByType('list'));
    return subject;
  }

  async function saveZsetToRedis(keyName, zset) {
    for (const [x, score] of zset) {
      await redis.addMemberToZset(keyName, x, score);
    }
  }
});