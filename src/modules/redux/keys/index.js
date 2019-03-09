// @ts-check
export const ADD_NEW_KEY_SUCCESS = 'redis-term/keys/ADD_NEW_KEY_SUCCESS';
export const FILTER_KEYS_STARTED = 'redis-term/keys/FILTER_KEYS_STARTED';
export const FILTER_KEYS_SUCCESS = 'redis-term/keys/FILTER_KEYS_SUCCESS';
export const DELETE_KEY_SUCCESS = 'redis-term/keys/DELETE_KEY_SUCCESS';
export const SELECT_KEY_SUCCESS = 'redis-term/keys/SELECT_KEY_SUCCESS';
export const UNSELECT_KEY = 'redis-term/keys/UNSELECT_KEY';

/**
 * @param {string} key 
 * @returns {import('../store').Thunk}
 */
const selectKey = key => async (dispatch, getState, { redis }) => {
  const type = await redis.typeOf(key);
  dispatch(selectKeySuccess({ key, type }));
};

/**
 * @param {string} key 
 */
const unselectKey = key => ({
  type: UNSELECT_KEY,
  payload: { key }
});

/**
 * @param {object} param0 
 * @prop {string} param0.key
 * @prop {string} param0.type
 */
const selectKeySuccess = ({ key, type }) => ({
  type: SELECT_KEY_SUCCESS,
  payload: { key, type }
});

/**
 * @param {string} keyName 
 * @param {string} type 
 */
const addNewKeyIfNotExists = (keyName, type) => async (dispatch, getState, { redis }) => {
  await redis.addNewKeyIfNotExists(keyName, type);
  dispatch(addNewKeySuccess(keyName));
};

const filterKeys = (pattern = '*') => async (dispatch, getState, { redis }) => {
  dispatch(filterKeysStarted());
  const keys = await redis.filterKeysStartWith(pattern);
  dispatch(filterKeysSuccess(keys));
};

/**
 * @param {string} key 
 */
const deleteKey = key => async (dispatch, getState, { redis }) => {
  await redis.deleteKey(key);
  dispatch(deleteKeySuccess(key));
};

/**
 * @param {string} key 
 */
const addNewKeySuccess = key => ({
  type: ADD_NEW_KEY_SUCCESS,
  payload: { key }
});

const filterKeysStarted = () => ({
  type: FILTER_KEYS_STARTED
});

const filterKeysSuccess = keys => ({
  type: FILTER_KEYS_SUCCESS,
  payload: { keys }
});

const deleteKeySuccess = key => ({
  type: DELETE_KEY_SUCCESS,
  payload: { key }
});

export const operations = {
  filterKeys,
  addNewKeyIfNotExists,
  deleteKey,
  selectKey
};

export const actions = {
  unselectKey,
  addNewKeySuccess,
  filterKeysStarted,
  filterKeysSuccess,
  deleteKeySuccess,
  selectKeySuccess
};

/**
 * @typedef {object} KeysState
 * @prop {string[]} list
 * @prop {boolean} isLoading
 * @prop {string} [selectedKeyName]
 * @prop {string} [selectedKeyType]
 */
const initialState = {
  list: [],
  isLoading: false,
  selectedKeyName: null,
  selectedKeyType: null
};

/**
 * @param {KeysState} state 
 * @param {*} action 
 * @returns {KeysState}
 */
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SELECT_KEY_SUCCESS:
      return {
        ...state,
        selectedKeyName: action.payload.key,
        selectedKeyType: action.payload.type
      };
    case UNSELECT_KEY:
      return {
        ...state,
        selectedKeyName: null,
        selectedKeyType: null
      };
    case ADD_NEW_KEY_SUCCESS:
      return {
        ...state,
        list: state.list.indexOf(action.payload.key) > -1
          ? state.list
          : state.list.concat(action.payload.key)
      };
    case FILTER_KEYS_STARTED:
      return { ...state, isLoading: true };
    case FILTER_KEYS_SUCCESS:
      return {
        ...state,
        list: action.payload.keys,
        isLoading: false
      };
    case DELETE_KEY_SUCCESS:
      return {
        ...state,
        list: state.list.filter(key => key !== action.payload.key)
      };
    default:
      return state;
  }
}
