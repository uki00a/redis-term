import assert from 'assert';
import Redis from 'ioredis-mock';
import { renderHook, act } from '@testing-library/react-hooks';
import { useList } from './list';

describe('useList()', () => {
  describe('.addElementToList()', () => {
    it('should add a new element to a list', async () => {
      const keyName = 'test-list';
      const redis = new Redis({
        data: { [keyName]: ['hoge', 'fuga'] }
      });
      const { result } = renderHook(() => useList({ keyName, redis }));

      await actAsync(() => result.current.loadElements());
      await actAsync(() => result.current.addElementToList('piyo'));

      assert.deepEqual(result.current.elements, ['piyo', 'hoge', 'fuga']);
      assert.strictEqual(result.current.isSaving, false);
    });
  });

  describe('.updateElement()', async () => {
    it('should update a element at index', async () => {
      const keyName = 'test-list';
      const redis = new Redis({
        data: { [keyName]: ['hoge', 'fuga', 'piyo'] }
      });
      const { result } = renderHook(() => useList({ keyName, redis }));

      await actAsync(() => result.current.loadElements());
      await actAsync(() => result.current.updateElement(1, 'abc'));

      assert.deepEqual(result.current.elements, ['hoge', 'abc', 'piyo']);
      assert.strictEqual(result.current.isSaving, false);
    });
  });

  const actAsync = callback => new Promise((resolve, reject) => {
    act(() => {
      callback().then(resolve).catch(reject);
    });
  });
});

