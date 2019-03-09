// @ts-check
const CONNECT_TO_REDIS_REQUEST = 'redis-term/database/CONNECT_TO_REDIS_REQUEST';
const CONNECT_TO_REDIS_SUCCESS = 'redis-term/database/CONNECT_TO_REDIS_SUCCESS';

/**
 * @param {object} options 
 * @returns {import('../store').Thunk}
 */
const connectToRedis = options => (dispatch, getState, { redis }) => {
  dispatch(connectToRedisRequest());
  return redis.connect(options)
    .then(() => dispatch(connectToRedisSuccess()));
};

const connectToRedisRequest = () => ({ type: CONNECT_TO_REDIS_REQUEST });
const connectToRedisSuccess = () => ({ type: CONNECT_TO_REDIS_SUCCESS });

/**
 * @typedef {object} DatabaseState
 * @prop {boolean} isConnecting
 * @prop {boolean} succeeded
 */
const initialState = { isConnecting: false, succeeded: false };

export const operations = { connectToRedis };
export const actions = {
  connectToRedisRequest,
  connectToRedisSuccess
};

/**
 * @param {DatabaseState} state 
 * @param {*} action 
 * @returns {DatabaseState}
 */
export default function reducer(state = initialState, action) {
  switch (action.type) { 
  case CONNECT_TO_REDIS_REQUEST:
    return { ...state, isConnecting: true };
  case CONNECT_TO_REDIS_SUCCESS:
    // TODO succeeded
    return { ...state, isConnecting: false, succeeded: true };
  default:
    return state;
  } 
}
