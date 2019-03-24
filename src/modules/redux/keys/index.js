// @ts-check
export const ADD_NEW_KEY_REQUEST = 'redis-term/keys/ADD_NEW_KEY_REQUEST';
export const ADD_NEW_KEY_SUCCESS = 'redis-term/keys/ADD_NEW_KEY_SUCCESS';
export const ADD_NEW_KEY_FAILURE = 'redis-term/keys/ADD_NEW_KEY_FAILURE';
export const FILTER_KEYS_STARTED = 'redis-term/keys/FILTER_KEYS_STARTED';
export const FILTER_KEYS_SUCCESS = 'redis-term/keys/FILTER_KEYS_SUCCESS';
export const FILTER_KEYS_FAILURED = 'redis-term/keys/FILTER_KEYS_FAILURED';
export const DELETE_KEY_REQUEST = 'redis-term/keys/DELETE_KEY_REQUEST';
export const DELETE_KEY_SUCCESS = 'redis-term/keys/DELETE_KEY_SUCCESS';
export const DELETE_KEY_FAILURE = 'redis-term/keys/DELETE_KEY_FAILURE';
export const SELECT_KEY_REQUEST = 'redis-term/keys/SELECT_KEY_REQUEST';
export const SELECT_KEY_SUCCESS = 'redis-term/keys/SELECT_KEY_SUCCESS';
export const SELECT_KEY_FAILURE = 'redis-term/keys/SELECT_KEY_FAILURE';
export const UNSELECT_KEY = 'redis-term/keys/UNSELECT_KEY';

/**
 * @param {string} key 
 * @returns {import('../store').Thunk}
 */
const selectKey = key => async (dispatch, getState, { redis }) => {
  if (isLoading(getState())) return;
  dispatch(selectKeyRequest());
  try {
    const type = await redis.typeOf(key);
    dispatch(selectKeySuccess({ key, type }));
  } catch (error) {
    dispatch(selectKeyFailure(error));
  }
};

/**
 * @param {string} key 
 */
const unselectKey = key => ({
  type: UNSELECT_KEY,
  payload: { key }
});

const selectKeyRequest = () => ({ type: SELECT_KEY_REQUEST });

/**
 * @param {object} param0 
 * @prop {string} param0.key
 * @prop {string} param0.type
 */
const selectKeySuccess = ({ key, type }) => ({
  type: SELECT_KEY_SUCCESS,
  payload: { key, type }
});

const selectKeyFailure = error => ({ type: SELECT_KEY_FAILURE, error });

/**
 * @param {string} keyName 
 * @param {string} type 
 */
const addNewKeyIfNotExists = (keyName, type) => async (dispatch, getState, { redis }) => {
  if (isSaving(getState())) return;
  dispatch(addNewKeyRequest());
  try {
    await redis.addNewKeyIfNotExists(keyName, type);
    dispatch(addNewKeySuccess(keyName));
  } catch (error) {
    dispatch(addNewKeyFailure(error));
  }
};

/**
 * @returns {import('../store').Thunk}
 */
const filterKeys = (pattern = '*') => async (dispatch, getState, { redis }) => {
  if (isLoading(getState())) return;
  dispatch(filterKeysStarted(pattern));
  try {
    const keys = await redis.filterKeysStartWith(pattern);
    dispatch(filterKeysSuccess(keys));
  } catch (error) {
    dispatch(filterKeysFailured(error));
  }
};

/**
 * @param {string} key 
 */
const deleteKey = key => async (dispatch, getState, { redis }) => {
  if (isSaving(getState())) return;
  dispatch(deleteKeyRequest());
  try {
    await redis.deleteKey(key);
    dispatch(deleteKeySuccess(key));
  } catch (error) {
    dispatch(deleteKeyFailure(error));
  }
};

const addNewKeyRequest = () => ({ type: ADD_NEW_KEY_REQUEST });

/**
 * @param {string} key 
 */
const addNewKeySuccess = key => ({
  type: ADD_NEW_KEY_SUCCESS,
  payload: { key }
});

const addNewKeyFailure = error => ({ type: ADD_NEW_KEY_FAILURE, error });

const filterKeysStarted = pattern => ({
  type: FILTER_KEYS_STARTED,
  payload: { pattern }
});

const filterKeysSuccess = keys => ({
  type: FILTER_KEYS_SUCCESS,
  payload: { keys }
});

const filterKeysFailured = error => ({ type: FILTER_KEYS_FAILURED, error });

const deleteKeyRequest = () => ({ type: DELETE_KEY_REQUEST });

const deleteKeySuccess = key => ({
  type: DELETE_KEY_SUCCESS,
  payload: { key }
});

const deleteKeyFailure = error => ({ type: DELETE_KEY_FAILURE, error });

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
 * @prop {string} pattern
 * @prop {boolean} isLoading
 * @prop {boolean} isSaving
 * @prop {string} [selectedKeyName]
 * @prop {string} [selectedKeyType]
 */
const initialState = {
  list: [],
  pattern: null,
  isLoading: false,
  isSaving: false,
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
    case SELECT_KEY_REQUEST:
      return { ...state, isLoading: true };
    case SELECT_KEY_SUCCESS:
      return {
        ...state,
        isLoading: false,
        selectedKeyName: action.payload.key,
        selectedKeyType: action.payload.type
      };
    case SELECT_KEY_FAILURE:
      return { ...state, isLoading: false };
    case UNSELECT_KEY:
      return {
        ...state,
        selectedKeyName: null,
        selectedKeyType: null
      };
    case ADD_NEW_KEY_REQUEST:
      return { ...state, isSaving: true };
    case ADD_NEW_KEY_SUCCESS:
      return {
        ...state,
        isSaving: false,
        list: state.list.indexOf(action.payload.key) > -1
          ? state.list
          : state.list.concat(action.payload.key)
      };
    case ADD_NEW_KEY_FAILURE:
      return { ...state, isSaving: false };
    case FILTER_KEYS_STARTED:
      return { ...state, pattern: action.payload.pattern, isLoading: true };
    case FILTER_KEYS_SUCCESS:
      return {
        ...state,
        list: action.payload.keys,
        isLoading: false
      };
    case FILTER_KEYS_FAILURED:
      return { ...state, isLoading: false };
    case DELETE_KEY_REQUEST:
      return { ...state, isSaving: true };
    case DELETE_KEY_SUCCESS:
      return {
        ...state,
        isSaving: false,
        list: state.list.filter(key => key !== action.payload.key)
      };
    case DELETE_KEY_FAILURE:
      return { ...state, isSaving: false };
    default:
      return state;
  }
}

/**
 * @typedef {import('../store').State} State
 * @param {State} state 
 */
const isLoading = state => state.keys.isLoading;

/**
 * @param {State} state
 */
const isSaving = state => state.keys.isSaving;