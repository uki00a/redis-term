import assert from 'assert';
import reducer, { actions } from './index';

describe('string duck', () => {
  it('can handle SAVE_STRING_SUCCESS', () => {
    const previousState = { value: 'a', isSaving: true };
    const result = reducer(previousState, actions.saveStringSuccess('b'));

    assert.equal(result.value, 'b');
    assert.equal(result.isSaving, false);
  });

  it('can handle LOAD_STRING_SUCCESS', () => {
    const previousState = { isLoading: true };
    const result = reducer(previousState, actions.loadStringSuccess('test-string'));

    assert.equal(result.value, 'test-string');
    assert.equal(result.isLoading, false);
  });
});