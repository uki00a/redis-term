export const SCAN_KEYS_STARTED = 'SCAN_KEYS_STARTED';
export const SCAN_KEYS_FINISHED = 'SCAN_KEYS_FINISHED';
export const SCAN_KEYS_MATCHED = 'SCAN_KEY_MATCHED';
export const GET_KEY_CONTENT_SUCCEEDED = 'GET_VALUE_FOR_KEY_SUCCEEDED';

const INITIAL_CURSOR = 0;

const getRedisClient = state => state.connections.redis;

export const scanKeys = ({
  pattern = '*',
  count = 100
} = {}) => (dispatch, getState) => {
  const state = getState();
  const redis = getRedisClient(state);

  async function loop(cursor) {
    const [newCursor, fetchedKeys] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', count);   
    const done = Number(newCursor) === 0;

    dispatch({ type: SCAN_KEYS_MATCHED, payload: fetchedKeys }); 

    if (done) {
      return dispatch({ type: SCAN_KEYS_FINISHED });
    } else {
      return await loop(newCursor);
    }
  }

  dispatch({ type: SCAN_KEYS_STARTED });
  return loop(INITIAL_CURSOR);
};

const getValueByKeyAndType = async (redis, key, type) => {
  switch (type) {
  case 'hash':
    // FIXME
    return JSON.stringify(await redis.hgetall(key));
  case 'string':
    return await redis.get(key);
  case 'list':
    // FIXME
    return JSON.stringify(await redis.lrange(key, 0, -1)); 
  default:
    throw new Error('not implemented');
  }
};

export const getKeyContent = key => async (dispatch, getState) => {
  const state = getState();
  const redis = getRedisClient(state);

  const type = await redis.type(key);
  const value = await getValueByKeyAndType(redis, key, type);
 
  dispatch({
    type: GET_KEY_CONTENT_SUCCEEDED,      
    payload: { value, type }
  });
};

const defaultState = { keys: [], keyContent: {} };

const reducer = (state = defaultState, action = {}) => {
  switch (action.type) {
  case GET_KEY_CONTENT_SUCCEEDED:
    return { ...state, keyContent: action.payload };
  case SCAN_KEYS_STARTED:
    return { ...state, keys: [] };
  case SCAN_KEYS_MATCHED:
    return {
      ...state,
      keys: state.keys.concat(action.payload)
    };
  default:
    return state;
  }
};

export default reducer;
