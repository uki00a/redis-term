import assert from 'assert';
import reducer, { actions } from './index';

describe('connections duck', () => {
  it('can handle LOAD_CONNECTIONS_SUCCESS', () => {
    const action = actions.loadConnectionsSuccess([{ id: 1, host: 'localhost', port: 6379 }]);
    const result = reducer(null, action);

    assert.deepEqual(result.list, [{ id: 1, host: 'localhost', port: 6379 }]);
    assert.equal(result.isLoading, false);
  });

  it('can handle ADD_CONNECTION_SUCCESS', () => {
    const previousState = { list: [{ id: 1, host: '127.0.0.1', port: 6379 }] };
    const action = actions.addConnectionSuccess({ id: 2, host: 'localhost', port: 6379 })
    const result = reducer(previousState, action);

    assert.deepEqual(result.list, [
      { id: 1, host: '127.0.0.1', port: 6379 },
      { id: 2, host: 'localhost', port: 6379 }
    ]);
    assert.equal(result.isSaving, false);
  });

  it('can handle UPDATE_CONNECTION_SUCCESS', () => {
    const previousState = {
      list: [
        { id: 1, host: '127.0.0.1', port: 6379 },
        { id: 2, host: 'localhost', port: 6379 }
      ]
    };
    const action = actions.updateConnectionSuccess({ id: 2, host: 'http://hoge.example.com', port: 6380 });
    const result = reducer(previousState, action);

    assert.deepEqual(result.list, [
      { id: 1, host: '127.0.0.1', port: 6379 },
      { id: 2, host: 'http://hoge.example.com', port: 6380 }
    ])
    assert.equal(result.isSaving, false);
  });

  it('can handle DELETE_CONNECTION_SUCCESS', () => {
    const previousState = {
      list: [
        { id: 1, host: '127.0.0.1', port: 6379 },
        { id: 2, host: 'localhost', port: 6379 }
      ]
    };
    const action = actions.deleteConnectionSuccess({ id: 2, host: 'localhost', port: 6379 });
    const result = reducer(previousState, action);
    
    assert.deepEqual(result.list, [{ id: 1, host: '127.0.0.1', port: 6379 }]);
    assert.equal(result.isSaving, false);
  });

  it('can handle EDIT_CONNECTION', () => {
    const action = actions.editConnection({ id: 1, host: '127.0.0.1', port: 6379 });
    const result = reducer(null, action);

    assert.deepEqual(result.editingConnection, { id: 1, host: '127.0.0.1', port: 6379 });
  });
});