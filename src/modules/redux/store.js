// @ts-check
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import string from './string';
import list from './list';
import set from './set';
import zset from './zset';
import hash from './hash';
import database from './database';
import keys from './keys';
import keyboardBindings from './keyboard-bindings';

import { createFacade as createRedisFacade } from '../redis/facade';

/**
 * @typedef {{ redis: import('../redis/facade').Facade }} ThunkDependencies
 * 
 * @typedef {object} State
 * @prop {import('./set').SetState} set 
 * @prop {import('./zset').ZsetState} zset
 * @prop {import('./hash').HashState} hash
 * @prop {import('./list').ListState} list
 * @prop {import('./string').StringState} string
 * @prop {import('./keys').KeysState} keys
 * @prop {import('./database').DatabaseState} database
 * @prop {import('./keyboard-bindings').KeyboardBindingsState} keyboardBindings
 * 
 * @typedef {(dispatch: import('redux').Dispatch, getState: () => State, extraArgument: ThunkDependencies) => any} Thunk
 */

const rootReducer = combineReducers({
  database,
  string,
  list,
  set,
  zset,
  hash,
  keys,
  keyboardBindings
});

const createStoreWithMiddleware = applyMiddleware(thunk.withExtraArgument({
  redis: createRedisFacade()
}))(createStore);

export default function configureStore (initialState) {
  return createStoreWithMiddleware(rootReducer, initialState);
}
