import assert from 'assert';
import noop from 'lodash/noop';
import { renderHook, act } from '@testing-library/react-hooks';
import { useKeyboardBindings } from './keyboard-bindings';

describe('useKeyboardBindings()', () => {
  describe('.enableKeyboardBindings()', () => {
    it('should enable given keyboard bindings', () => {
      const previousKeyboardBindings = [
        { key: 'C-c', handler: noop, description: 'test' }
      ];
      const givenKeyboardBindings = [
        { key: 'C-r', handler: noop, description: 'Reload' },
        { key: 'C-d', handler: noop, description: 'Delete Key' }
      ];
      const { result } = renderHook(() => useKeyboardBindings(previousKeyboardBindings));

      act(() => {
        result.current.enableKeyboardBindings(givenKeyboardBindings);
      });

      const actual = result.current.keyboardBindings;
      const expected = previousKeyboardBindings.concat(givenKeyboardBindings);
      assert.deepEqual(actual, expected);
    });
  });

  describe('.disableKeyboardBindings()', () => {
    it('should disable given keyboard bindings', () => {
      const previousKeyboardBindings = [
       { key: 'C-c', handler: noop, description: 'test' },
       { key: 'C-r', handler: noop, description: 'Reload' },
       { key: 'C-d', handler: noop, description: 'Delete Key' }
      ];
      const givenKeyboardBindings = [
        { key: 'C-r', hanler: noop, description: 'Reload' },
        { key: 'C-d', handler: noop, description: 'Delete Key' }
      ];
      const { result } = renderHook(() => useKeyboardBindings(previousKeyboardBindings));

      act(() => {
        result.current.disableKeyboardBindings(givenKeyboardBindings);
      });
  
      const actual = result.current.keyboardBindings;
      const expected = [{ key: 'C-c', handler: noop, description: 'test' }];
      assert.deepEqual(actual, expected);
    });
  });
});
