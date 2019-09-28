import React from 'react';
import SetContentContainer from '../../src/containers/set-content';
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
import assert from 'assert';
import fixtures from '../fixtures';

describe('<SetContentContainer>', () => {
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

  it('can add a new member to a set when "a" key is pressed on member list', async () => {
    const keyName = fixtures.redisKey();
    const initialSet = ['hoge', 'fuga'];
    await saveSetToRedis(keyName, initialSet);

    const { getByType, getByContent, getBy } = await renderSubject({ redis, screen, keyName });
    const memberList = getByType('list');

    assert.strictEqual(2, memberList.ritems.length);
    assert(initialSet.every(member => memberList.ritems.includes(member)));

    memberList.focus();
    simulate.keypress(memberList, 'a');

    const memberInput = getByType('textbox');
    const okButton = getByContent(/OK/i);
    const newMember = 'piyo';

    memberInput.setValue(newMember);
    fireEvent.click(okButton);
    await waitForElementToBeHidden(() => getBy(x => x.name === 'loader'));

    const expected = initialSet.concat(newMember);
    const actual = await getSetMembers(keyName);
    assert.strictEqual(3, actual.length);
    assert(expected.every(member => actual.includes(member)));
    assert.strictEqual(3, memberList.ritems.length);
    assert(expected.every(member => memberList.ritems.includes(member)));
  });

  it('can delete a selected member when "d" key is pressed on member list', async () => {
    const keyName = fixtures.redisKey();
    const initialSet = ['hoge', 'fuga', 'piyo'];
    await saveSetToRedis(keyName, initialSet);

    const { getByType, getByContent, getBy } = await renderSubject({ redis, screen, keyName });
    const memberList = getByType('list');

    assert.strictEqual(3, memberList.ritems.length);
    assert(initialSet.every(member => memberList.ritems.includes(member)));

    const memberToDelete = memberList.ritems[1];
    memberList.focus();
    simulate.select(memberList, 1);
    simulate.keypress(memberList, 'd');

    const okButton = getByContent(/OK/i);
    fireEvent.click(okButton);
    await waitForElementToBeHidden(() => getBy(x => x.name === 'loader'));

    const expected = initialSet.filter(member => member !== memberToDelete);
    {
      const actual = await getSetMembers(keyName);
      assert.strictEqual(2, actual.length, 'selected member should be deleted from redis');
      assert(expected.every(member => actual.includes(member)), 'selected member should be deleted from redis');
    }

    {
      assert.strictEqual(2, memberList.ritems.length, 'selected member should be removed from member list');
      assert(expected.every(member => memberList.ritems.includes(member)), 'selected member should be removed from member list');
    }
  });

  it('should reload a set when "C-r" is pressed on a member list', async () => {
    const keyName = fixtures.redisKey();
    const initialSet = ['hoge'];
    await saveSetToRedis(keyName, initialSet);

    const { getByType } = await renderSubject({ redis, keyName, screen });
    const memberList = getByType('list');
    assert.strictEqual(1, memberList.ritems.length, 'should load a set when mounted');
    assert(initialSet.every(member => memberList.ritems.includes(member)));

    const newSet = [...initialSet, 'piyo'];
    await saveSetToRedis(keyName, newSet);    

    memberList.focus();
    simulate.keypress(memberList, 'C-r');

    {
      await waitFor(() => getByType('list'));
      const memberList = getByType('list');
      assert.strictEqual(2, memberList.ritems.length, 'a set should be reloaded');
      assert(newSet.every(member => memberList.ritems.includes(member)), 'a set should be reloaded');
    }
  });

  async function renderSubject({ redis, screen, keyName }) {
    const subject = render(
      <SetContentContainer keyName={keyName} redis={redis} />,
      screen
    );
    await waitFor(() => subject.getByType('list'));
    return subject;
  }

  async function saveSetToRedis(keyName, set) {
    await redis.del(keyName);
    for (const x of set) {
      await redis.sadd(keyName, x);
    }
  }

  async function getSetMembers(keyName, pattern = '*') {
    const cursor = 0;
    const count = 1000;
    const [_, members] = await redis.sscan( // eslint-disable-line no-unused-vars
      keyName,
      cursor,
      'MATCH',
      pattern,
      'COUNT',
      count
    );
    return members;
  }
});