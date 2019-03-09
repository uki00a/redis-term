import reducer, { actions } from './index';
import assert from 'assert';

describe('list duck', () => {
  it('can handle LOAD_LIST_ELEMENTS_SUCCESS', () => {
    const previousState = { isLoading: true };
    const action = actions.loadListElementsSuccess(['a', 'b']);
    const result = reducer(previousState, action);

    assert(!result.isLoading);
    assert.deepEqual(result.elements, ['a', 'b']);
  });

  it('can handle ADD_ELEMENT_TO_LIST_SUCCESS', () => {
    const previousState = { elements: ['hoge', 'fuga'] };
    const action = actions.addElementToListSuccess('piyo');
    const result = reducer(previousState, action);

    assert.deepEqual(result.elements, ['hoge', 'fuga', 'piyo']);
  });

  it('can handle UPDATE_LIST_ELEMENT_SUCCESS', () => {
    const previousState = { elements: ['hoge', 'fuga', 'piyo'] };
    const action = actions.updateListElementSuccess(1, 'FUGAFUGA');
    const result = reducer(previousState, action);

    assert.deepEqual(result.elements, ['hoge', 'FUGAFUGA', 'piyo']);
  });
});