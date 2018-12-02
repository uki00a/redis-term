export const SCAN_KEYS_STARTED = 'SCAN_KEYS_STARTED';
export const SCAN_KEYS_FINISHED = 'SCAN_KEYS_FINISHED';
export const SCAN_KEYS_MATCHED = 'SCAN_KEY_MATCHED';

const INITIAL_CURSOR = 0;

export const scanKeys = ({
  pattern = '*',
  count = 100
} = {}) => (dispatch, getState) => {
  const state = getState();
  const redis = state.connections.redis;

  async function loop(cursor) {
    const [newCursor, fetchedKeys] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', count);   
    const done = Number(newCursor) === 0;

    if (done) {
      return dispatch({ type: SCAN_KEYS_FINISHED });
    } else {
      dispatch({ type: SCAN_KEYS_MATCHED, payload: fetchedKeys }); 
      return await loop(newCursor);
    }
  }

  dispatch({ type: SCAN_KEYS_STARTED });
  return loop(INITIAL_CURSOR);
};

const defaultState = [];

const reducer = (state = defaultState, action = {}) => {
  switch (action.type) {
  case SCAN_KEYS_STARTED:
    return [];
  case SCAN_KEYS_MATCHED:
    return state.concat(action.payload);
  default:
    return defaultState;
  }
};

export default reducer;
