import assert from 'assert';
import Redis from 'ioredis-mock';
import { renderHook, act } from '@testing-library/react-hooks';
import { useZset } from './zset';

describe('useZset()', () => {
  describe('.addMemberAndScore()', () => {
    it('should add a new member to a set', async () => {
      const keyName = 'test-zset';
      const redis = createRedisStub({
        [keyName]: createZset([['hoge', 1], ['fuga', 2]])
      });
      const { result } = renderHook(() => useZset({ keyName, redis }));

      await actAsync(() => result.current.loadMembersAndScores('*'));
      await actAsync(() => result.current.addMemberAndScore('piyo', 3));

      assert.deepEqual(result.current.members, ['piyo', 'hoge', 'fuga']);
      assert.deepEqual(result.current.scores, [3, 1, 2]);
      assert.strictEqual(result.current.isSaving, false);
    });
  });

  describe('.updateScore()', () => {
    it('should update a score', async () => {
      const keyName = 'test-zset';
      const redis = createRedisStub({
        [keyName]: createZset([['hoge', 1], ['fuga', 2]])
      });
      const { result } = renderHook(() => useZset({ keyName, redis }));

      await actAsync(() => result.current.loadMembersAndScores('*'));
      await actAsync(() => result.current.updateScore('fuga', 20));

      assert.deepEqual(result.current.members, ['hoge', 'fuga']);
      assert.deepEqual(result.current.scores, [1, 20]);
      assert.strictEqual(result.current.isSaving, false);
    });
  });

  describe('.deleteMember()', () => {
    it('should delete a member', async () => {
      const keyName = 'test-zset';
      const redis = createRedisStub({
        [keyName]: createZset([['hoge', 1], ['fuga', 2], ['piyo', 3]])
      });
      const { result } = renderHook(() => useZset({ keyName, redis }));

      await actAsync(() => result.current.loadMembersAndScores('*'));
      await actAsync(() => result.current.deleteMember('fuga'));

      assert.deepEqual(result.current.members, ['hoge', 'piyo']);
      assert.deepEqual(result.current.scores, [1, 3]);
      assert.strictEqual(result.current.isSaving, false);
    });
  });

  const actAsync = callback => new Promise((resolve, reject) => {
    act(() => {
      callback().then(resolve).catch(reject);
    });
  });

  function createZset(entries) {
    return new Map(entries.map(([member, score]) => [member, { score, value: member }]));
  }

  // FIXME
  function createRedisStub(data) {
    const redis = new Redis({ data });
    const origZscan = redis.zscan;

    // patch zscan
    redis.zscan = function patchedZscan(key, ...restArgs) {
      return origZscan.call(redis, key, ...restArgs).then(async ([cursor, members]) => {
        const result = [];
        for (const member of members) {
          const score = await redis.zscore(key, member);
          result.push(member, score);
        }
        return [cursor, result];
      });
    };

    return redis;
  }
});
