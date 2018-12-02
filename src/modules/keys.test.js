import keysReducer, { SCAN_KEYS_MATCHED } from './keys';
import assert from 'assert';

describe('keysReducer', () => {
  it('handles no arguments', () => {
    const expected = [];
    const actual = keysReducer();

    assert.deepEqual(
      expected,
      actual,
      'should return default state'
    ); 
  });

  context('on SCAN_KEYS_MATCHED', () => {
    it('should add payload to state', () => {
      const expected = ['a', 'B', 'C'];
      const actual = keysReducer(['a'], {
        type: SCAN_KEYS_MATCHED,
        payload: ['B', 'C']
      });

      assert.deepEqual(
        expected,
        actual
      );
    });
  });
});




