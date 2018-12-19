export const SCAN_KEYS_STARTED = 'SCAN_KEYS_STARTED';
export const SCAN_KEYS_FINISHED = 'SCAN_KEYS_FINISHED';
export const SCAN_KEYS_MATCHED = 'SCAN_KEY_MATCHED';
export const GET_KEY_CONTENT_SUCCEEDED = 'GET_VALUE_FOR_KEY_SUCCEEDED';

const INITIAL_CURSOR = 0;

export const scanKeys = ({
  pattern = '*',
  count = 100
} = {}) => async (dispatch, getState, { redis }) => {
  dispatch({ type: SCAN_KEYS_STARTED });

  // FIXME
  const [newCursor, fetchedKeys] = await redis.scanKeys();


  dispatch({ type: SCAN_KEYS_MATCHED, payload: fetchedKeys }); 
  // FIXME
  dispatch({ type: SCAN_KEYS_FINISHED });
};

export const getKeyContent = key => async (dispatch, getState, { redis }) => {
  const { value, type } = await redis.getKeyContent(key);
 
  dispatch({
    type: GET_KEY_CONTENT_SUCCEEDED,      
    payload: {
      // FIXME
      value: JSON.stringify(value),
      type: type
    }
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
