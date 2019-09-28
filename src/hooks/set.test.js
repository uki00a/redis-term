import assert from 'assert';
import Redis from 'ioredis-mock';
import { renderHook, act } from '@testing-library/react-hooks';
import { useSet } from './set';

describe('useSet()', () => {
  describe('.addMember()', () => {
    it('should add a new member to a set', async () => {
      const keyName = 'test-set';
      const redis = new Redis({
        data: { [keyName]: new Set(['hoge', 'fuga']) }
      });
      const { result } = renderHook(() => useSet({ keyName, redis }));

      await actAsync(() => result.current.loadMembers('*'));
      await actAsync(() => result.current.addMember('piyo'));

      assert.deepEqual(result.current.members, ['hoge', 'fuga', 'piyo']);
      assert.strictEqual(result.current.isSaving, false);
    });
  });

  describe('.deleteMember()', async () => {
    it('should delete a member from a set', async () => {
      const keyName = 'test-set';
      const redis = new Redis({
        data: { [keyName]: new Set(['piyo', 'hoge', 'fuga']) }
      });
      const { result } = renderHook(() => useSet({ keyName, redis }));

      await actAsync(() => result.current.loadMembers('*'));
      await actAsync(() => result.current.deleteMember('hoge'));

      assert.deepEqual(result.current.members, ['piyo', 'fuga']);
      assert.strictEqual(result.current.isSaving, false);
    });
  });

  const actAsync = callback => new Promise((resolve, reject) => {
    act(() => {
      callback().then(resolve).catch(reject);
    });
  });
});

