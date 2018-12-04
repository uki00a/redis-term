import databaseReducer, { SCAN_KEYS_MATCHED } from './database';
import assert from 'assert';

describe('databaseReducer', () => {
  it('handles no arguments', () => {
    const expected = {
      keys: [],
      keyContent: null
    };
    const actual = databaseReducer();

    assert.deepEqual(
      actual,
      expected,
      'should return default state'
    ); 
  });

  context('on SCAN_KEYS_MATCHED', () => {
    it('should add payload to "keys"', () => {
      const state = { keys: ['a'] };
      const expected = { keys: ['a', 'B', 'C'] };
      const actual = databaseReducer(state, {
        type: SCAN_KEYS_MATCHED,
        payload: ['B', 'C']
      });

      assert.deepEqual(
        actual,
        expected
      );
    });
  });
});




