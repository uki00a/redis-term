// @ts-check
import reducer, { actions } from './index';
import assert from 'assert';

describe('keys duck', () => {
  it('can handle ADD_NEW_KEY_SUCCESS', () => {
    const action = actions.addNewKeySuccess('NEW-KEY');
    const result = reducer(initialState({ list: ['a'] }), action);

    assert.deepEqual(result.list, ['a', 'NEW-KEY']);
  });

  it('can handle DELETE_KEY_SUCCESS', () => {
    const previousState = initialState({ list: ['a', 'KEY-TO-DELETE', 'b'] });
    const action = actions.deleteKeySuccess('KEY-TO-DELETE');
    const result = reducer(previousState, action);

    assert.deepEqual(result.list, ['a', 'b']);
  });

  it('can handle FILTER_KEYS_SUCCESS', () => {
    const previousState = initialState({ isLoading: true });
    const action = actions.filterKeysSuccess(['hoge', 'piyo']);
    const result = reducer(previousState, action);

    assert.deepEqual(result.list, ['hoge', 'piyo']);
    assert(!result.isLoading);
  });

  it('can handle SELECT_KEY_SUCCESS', () => {
    const previousState = initialState();
    const action = actions.selectKeySuccess({ key: 'fuga', type: 'string' });
    const result = reducer(previousState, action);

    assert.equal(result.selectedKeyName, 'fuga');
    assert.equal(result.selectedKeyType, 'string');
  });

  const initialState = override => ({
    list: [],
    isLoading: false,
    ...override
  });
});
