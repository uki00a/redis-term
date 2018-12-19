import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './modules/redux';

import { createRedisClient } from './modules/redis/redis-client';

const redis = createRedisClient();
const createStoreWithMiddleware = applyMiddleware(
  thunk.withExtraArgument({ redis })
)(createStore);

export default function configureStore(initialState) {
  return createStoreWithMiddleware(rootReducer, initialState);
}

