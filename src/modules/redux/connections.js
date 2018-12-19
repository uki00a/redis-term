const CONNECT_SUCCEEDED = 'CONNECT_SUCCEEDED';

export const connect = config => async (dispatch, getState, { redis }) => {
  await redis.connect(config);

  dispatch({ type: CONNECT_SUCCEEDED });
};

const defaultState = {
};

const reducer = (state = defaultState, action = {}) => {
  switch (action.type) {
  case CONNECT_SUCCEEDED:
    return state;
  default:
    return state;
  }
};

export default reducer;
