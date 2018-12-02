import keysReducer from './keys';
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
});




