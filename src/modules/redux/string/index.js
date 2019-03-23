// @ts-check
import { getSelectedKey } from '../shared';

const SAVE_STRING_REQUEST = 'redis-term/string/SAVE_STRING_REQUEST';
const SAVE_STRING_SUCCESS = 'redis-term/string/SAVE_STRING_SUCCESS';
const SAVE_STRING_FAILURE = 'redis-term/string/SAVE_STRING_FAILURE';
const LOAD_STRING_REQUEST = 'redis-term/string/LOAD_STRING_REQUEST';
const LOAD_STRING_SUCCESS = 'redis-term/string/LOAD_STRING_SUCCESS';
const LOAD_STRING_FAILURE = 'redis-term/string/LOAD_STRING_FAILURE';

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
  if (isSaving(getState())) return Promise.resolve();
  dispatch(saveStringRequest());
  const selectedKey = getSelectedKey(getState);
  try {
    await redis.saveString(selectedKey, newValue);
    dispatch(saveStringSuccess(newValue));
  } catch (error) {
    dispatch(saveStringFailure(error));
  }
};

const loadStringRequest = () => ({ type: LOAD_STRING_REQUEST });
const loadStringSuccess = string => ({
  type: LOAD_STRING_SUCCESS,
  payload: { string }
});

const saveStringRequest = () => ({ type: SAVE_STRING_REQUEST });
const saveStringSuccess = newValue => ({
  type: SAVE_STRING_SUCCESS,
  payload: { value: newValue }
});
const saveStringFailure = error => ({ type: SAVE_STRING_FAILURE, error });

/**
 * @typedef {object} StringState
 * @prop {string} [value]
 * @prop {boolean} isLoading
 */
const initialState = { value: null, isLoading: true, isSaving: false };

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
  case SAVE_STRING_REQUEST:
    return { ...state, isSaving: true };
  case SAVE_STRING_SUCCESS:
    return { ...state, value: action.payload.value, isSaving: false };
  case SAVE_STRING_FAILURE:
    return { ...state, isSaving: false };
  case LOAD_STRING_SUCCESS:
    return { ...state, isLoading: false, value: action.payload.string };
  case LOAD_STRING_REQUEST:
    return { ...state, value: null, isLoading: true };
  case LOAD_STRING_FAILURE:
    return { ...state, isLoading: false };
  default:
    return state;
  }
}

const isSaving = state => state.string.isSaving;