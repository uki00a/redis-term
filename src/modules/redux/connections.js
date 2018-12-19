import Redis from 'ioredis';

const CONNECT_SUCCEEDED = 'CONNECT_SUCCEEDED';

export const connect = config => (dispatch, getState) => {
  const redis = new Redis(config);
  const connection = { redis };

  dispatch({ type: CONNECT_SUCCEEDED, payload: connection });
};

const defaultState = {
};

const reducer = (state = defaultState, action = {}) => {
  switch (action.type) {
  case CONNECT_SUCCEEDED:
    return action.payload;
  default:
    return state;
  }
};

export default reducer;
