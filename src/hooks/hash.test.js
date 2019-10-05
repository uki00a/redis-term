import assert from 'assert';
import Redis from 'ioredis-mock';
import { renderHook, act } from '@testing-library/react-hooks';
import { useHash } from './hash';
import { create } from 'react-test-renderer';

describe('useHash()', () => {
  describe('.addFieldToHash()', () => {
    it('should add a new field to a hash', async () => {
      const keyName = 'test';
      const redis = createRedisStub({
        [keyName]: { 'a': '1', 'b': '2' }
      });

      const { result } = renderHook(() => useHash({
        keyName,
        redis
      }));

      await actAsync(() => result.current.loadHash('*'));
      await actAsync(() => result.current.addFieldToHash('c', '3'));

      assert.deepEqual(result.current.hash, { a: '1', b: '2', c: '3' });
      assert.equal(result.current.isSaving, false);
    });
  });

  describe('.deleteField()', () => {
    it('should delete a field from a hash', async () => {
      const keyName = 'test';
      const redis = createRedisStub({
        [keyName]: { a: '100', b: '200', c: '300' }
      });

      const { result } = renderHook(() => useHash({ keyName, redis }));

      await actAsync(() => result.current.loadHash('*'));
      await actAsync(() => result.current.deleteField('b'));
  
      assert.deepEqual(result.current.hash, { a: '100', c: '300' });
      assert.equal(result.current.isSaving, false);
    });
  });

  const actAsync = callback => new Promise((resolve, reject) => {
    act(() => {
      callback().then(resolve).catch(reject);
    });
  });

  // FIXME
  function createRedisStub(data) {
    const redis = new Redis({ data });
    const origHscan = redis.hscan;

    // patch hscan
    redis.hscan = function patchedHscan(key, ...restArgs) {
      return origHscan.call(redis, key, ...restArgs).then(async ([cursor, fields]) => {
        const result = [];
        for (const field of fields) {
          const value = await redis.hget(key, field);
          result.push(field, value);
        }
        return [cursor, result];
      });
    };

    return redis;
  }
});