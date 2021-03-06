import React from 'react';
import ZsetContentContainer from '../../src/containers/zset-content';
import {
  connectToRedis,
  cleanupRedisConnection,
  render,
  waitFor,
  waitForElementToBeHidden,
  createScreen,
  simulate,
  fireEvent,
  unmount
} from '../helpers';
import { partitionByParity } from '../../src/modules/utils';
import assert from 'assert';
import fixtures from '../fixtures';

describe('<ZsetContentContainer>', () => { 
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

  it('can add a new member to a zset when "a" key is pressed on member list', async () => {
    const keyName = fixtures.redisKey();
    const initialZset = [['hoge', '1'], ['fuga', '2']];
    const initialMembers = ['hoge', 'fuga'];
    await saveZsetToRedis(keyName, initialZset);

    const { getByType, getByContent, getBy } = await renderSubject({ redis, screen, keyName });
    const memberList = getByType('list');

    assert.strictEqual(2, memberList.ritems.length);
    assert(initialMembers.every(member => memberList.ritems.includes(member)));

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
    const [actualMembers, actualScores] = await getZsetMembers(redis, keyName);

    assert.strictEqual(3, actualMembers.length);
    assert(expectedMembers.every(x => actualMembers.includes(x)));

    assert.strictEqual(3, actualScores.length);
    assert(expectedScores.every(x => actualScores.includes(x)));

    assert.strictEqual(3, memberList.ritems.length);
    assert(expectedMembers.every(x => memberList.ritems.includes(x)));
  });

  it('can delete a selected member when "d" key is pressed on member list', async () => {
    const keyName = fixtures.redisKey();
    const initialZset = [['hoge', '1'], ['fuga', '2'], ['piyo', '3']];
    const initialMembers = ['hoge', 'fuga', 'piyo'];
    await saveZsetToRedis(keyName, initialZset);

    const { getBy, getByType, getByContent } = await renderSubject({ redis, screen, keyName });
    const memberList = getByType('list');

    assert.strictEqual(3, memberList.ritems.length);
    assert(initialMembers.every(member => memberList.ritems.includes(member)));

    const memberToDelete = memberList.ritems[1];
    memberList.focus();
    simulate.select(memberList, 1);
    simulate.keypress(memberList, 'd');

    const okButton = getByContent(/OK/i);
    fireEvent.click(okButton);
    await waitForElementToBeHidden(() => getBy(x => x.name === 'loader'));

    const expectedMembers = initialMembers.filter(member => member !== memberToDelete);
    {
      const [actualMembers] = await getZsetMembers(redis, keyName);
      assert.strictEqual(2, actualMembers.length, 'selected member should be deleted from redis');
      assert(expectedMembers.every(member => actualMembers.includes(member)), 'selected member should be deleted from redis');
    }

    {
      assert.strictEqual(2, memberList.ritems.length, 'selected member should be removed from member list');
      assert(expectedMembers.every(member => memberList.ritems.includes(member)), 'selected member should be removed from member list');
    }
  });

  it('should reload members when "C-r" is pressed on a member list', async () => {
    const keyName = fixtures.redisKey();
    const initialZset = [['hoge', '1']];
    const initialMembers = ['hoge'];
    await saveZsetToRedis(keyName, initialZset);

    const { getByType } = await renderSubject({ redis, screen, keyName });
    const memberList = getByType('list');

    assert.strictEqual(initialMembers.length, memberList.ritems.length, 'should load members when mounted');
    assert(initialMembers.every(member => memberList.ritems.includes(member)), 'should load members when mounted');

    const newZset = [...initialZset, ['fuga', '2']];
    await saveZsetToRedis(keyName, newZset);

    memberList.focus();
    simulate.keypress(memberList, 'C-r');
    await waitFor(() => getByType('list'));
    {
      const memberList = getByType('list');
      const expectedMembers = ['hoge', 'fuga'];
      assert.strictEqual(expectedMembers.length, memberList.ritems.length, 'should reload members when "C-r" is pressed on a member list');
      assert(expectedMembers.every(member => memberList.ritems.includes(member)), 'should reload members when "C-r" is pressed on a member list');
    }
  });

  async function renderSubject({ redis, screen, keyName }) {
    // TODO remove this
    const subject = render(
      <ZsetContentContainer keyName={keyName} redis={redis} />,
      screen
    );
    await waitFor(() => subject.getByType('list'));
    return subject;
  }

  async function saveZsetToRedis(keyName, zset) {
    await redis.del(keyName);
    for (const [x, score] of zset) {
      await redis.zadd(keyName, score, x);
    }
  }

  async function getZsetMembers(redis, keyName, pattern = '*') {
    const cursor = 0;
    const count = 1000;
    const [_, values] = await redis.zscan( // eslint-disable-line no-unused-vars
      keyName,
      cursor,
      'MATCH',
      pattern,
      'COUNT',
      count
    );
    return partitionByParity(values);
  }
});