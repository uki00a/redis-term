// @ts-check
import { getSelectedKey } from '../shared';

const SAVE_STRING_SUCCESS = 'redis-term/string/SAVE_STRING_SUCCESS';
const LOAD_STRING_REQUEST = 'redis-term/string/LOAD_STRING_REQUEST';
const LOAD_STRING_SUCCESS = 'redis-term/string/LOAD_STRING_SUCCESS';

/**
 * @returns {import('../store').Thunk}
 */
const loadString = () => async (dispatch, getState, { redis }) => {
  const selectedKey = getSelectedKey(getState);
  dispatch(loadStringRequest());
  const string = await redis.loadString(selectedKey);
  dispatch(loadStringSuccess(string));
};

/**
 * @param {string} newValue 
 * @returns {import('../store').Thunk}
 */
const saveString = newValue => async (dispatch, getState, { redis }) => {
  const selectedKey = getSelectedKey(getState);
  await redis.saveString(selectedKey, newValue);
  dispatch(saveStringSuccess(newValue));
};

const loadStringRequest = () => ({ type: LOAD_STRING_REQUEST });
const loadStringSuccess = string => ({
  type: LOAD_STRING_SUCCESS,
  payload: { string }
});

const saveStringSuccess = newValue => ({
  type: SAVE_STRING_SUCCESS,
  payload: { value: newValue }
});

/**
 * @typedef {object} StringState
 * @prop {string} [value]
 * @prop {boolean} isLoading
 */
const initialState = { value: null, isLoading: true };

export const operations = {
  loadString,
  saveString
};

export const actions = {
  loadStringRequest,
  loadStringSuccess,
  saveStringSuccess
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
  case SAVE_STRING_SUCCESS:
    return { ...state, value: action.payload.value };
  case LOAD_STRING_SUCCESS:
    return { ...state, isLoading: false, value: action.payload.string };
  case LOAD_STRING_REQUEST:
    return { ...state, value: null, isLoading: true };
  default:
    return state;
  }
}