import { combineReducers } from 'redux';
import connections from './connections';
import database from './database';

export default combineReducers({
  connections,
  database
});

