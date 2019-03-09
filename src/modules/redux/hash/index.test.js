import reducer, { actions } from './index';
import assert from 'assert';

describe('hash duck', () => {
  it('can handle FILTER_HASH_FIELDS_SUCCESS', () => {
    const previousState = { isLoading: true, value: {} }; 
    const action = actions.filterHashFieldsSuccess({ a: 1 });
    const result = reducer(previousState, action);

    assert(!result.isLoading);
    assert.deepEqual(result.value, { a: '1' });
  });

  it('can handle SET_HASH_FIELD_SUCCESS', () => {
    const previousState = { value: { a: '1', b: '2' } };
    const action = actions.setHashFieldSuccess('b', '33');
    const result = reducer(previousState, action);

    assert.deepEqual(result.value, { a: '1', b: '33' });
  });

  it('can handle DELETE_FIELD_FROM_HASH_SUCCESS', () => {
    const previousState = { value: { a: '100', b: '200', c: '300' } };
    const action = actions.deleteFieldFromHashSuccess('b');
    const result = reducer(previousState, action);

    assert.deepEqual(result.value, { a: '100', c: '300' });
  });
});