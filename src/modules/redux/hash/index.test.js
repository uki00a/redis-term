import reducer, { actions } from './index';
import assert from 'assert';

describe('hash duck', () => {
  it('can handle GET_HASH_FIELDS_SUCCESS', () => {
    const previousState = { isLoading: true, value: {} }; 
    const action = actions.getHashFieldsSuccess({ a: 1 });
    const result = reducer(previousState, action);

    assert.equal(result.isLoading, false);
    assert.deepEqual(result.value, { a: '1' });
  });

  it('can handle ADD_FIELD_TO_HASH_SUCCESS', () => {
    const previousState = { value: { a: '1', b: '2' } };
    const action = actions.addFieldToHashSuccess('c', '3');
    const result = reducer(previousState, action);

    assert.deepEqual(result.value, { a: '1', b: '2', c: '3' });
    assert.equal(result.isSaving, false);
  });

  it('can handle SET_HASH_FIELD_SUCCESS', () => {
    const previousState = { value: { a: '1', b: '2' } };
    const action = actions.setHashFieldSuccess('b', '33');
    const result = reducer(previousState, action);

    assert.deepEqual(result.value, { a: '1', b: '33' });
    assert.equal(result.isSaving, false);
  });

  it('can handle DELETE_FIELD_FROM_HASH_SUCCESS', () => {
    const previousState = { value: { a: '100', b: '200', c: '300' } };
    const action = actions.deleteFieldFromHashSuccess('b');
    const result = reducer(previousState, action);

    assert.deepEqual(result.value, { a: '100', c: '300' });
    assert.equal(result.isSaving, false);
  });
});