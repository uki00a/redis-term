import { combineReducers } from 'redux';
import connections from './connections';
import keys from './keys';

export default combineReducers({
  connections,
  keys
});

