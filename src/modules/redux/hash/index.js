// @ts-check
import { getSelectedKey } from '../shared';

const FILTER_HASH_FIELDS_REQUEST = 'redis-term/hash/FILTER_HASH_FIELDS_REQUEST';
const FILTER_HASH_FIELDS_SUCCESS = 'redis-term/hash/FILTER_HASH_FIELDS_SUCCESS';
const FILTER_HASH_FIELDS_FAILURE = 'redis-term/hash/FILTER_HASH_FIELDS_FAILURE';
const ADD_FIELD_TO_HASH_REQUEST = 'redis-term/hash/ADD_FIELD_TO_HASH_REQUEST';
const ADD_FIELD_TO_HASH_SUCCESS = 'redis-term/hash/ADD_FIELD_TO_HASH_SUCCESS';
const ADD_FIELD_TO_HASH_FAILURE = 'redis-term/hash/ADD_FIELD_TO_HASH_FAILURE';
const SET_HASH_FIELD_REQUEST = 'redis-term/hash/SET_HASH_FIELD_REQUEST';
const SET_HASH_FIELD_SUCCESS = 'redis-term/hash/SET_HASH_FIELD_SUCCESS';
const SET_HASH_FIELD_FAILURE = 'redis-term/hash/SET_HASH_FIELD_FAILURE';
const DELETE_FIELD_FROM_HASH_REQUEST = 'redis-term/hash/DELETE_FIELD_FROM_HASH_REQUEST';
const DELETE_FIELD_FROM_HASH_SUCCESS = 'redis-term/hash/DELETE_FIELD_FROM_HASH_SUCCESS';
const DELETE_FIELD_FROM_HASH_FAILURE = 'redis-term/hash/DELETE_FIELD_FROM_HASH_FAILURE';

/**
 * @param {string} pattern 
 * @returns {import('../store').Thunk}
 */
const filterHashFields = (pattern = '') => async (dispatch, getState, { redis }) => {
  if (isLoading(getState())) {
    return;
  }
  const selectedKey = getSelectedKey(getState);
  dispatch(filterHashFieldsRequest(pattern));
  try {
    const hash = await redis.filterHashFieldsStartWithPattern(selectedKey, pattern);
    dispatch(filterHashFieldsSuccess(hash));
  } catch (error) {
    dispatch(filterHashFieldsFailure(error));
  }
};

/**
 * @returns {import('../store').Thunk}
 */
const addFieldToHash = (fieldName, value) => async (dispatch, getState, { redis }) => {
  if (isSaving(getState())) {
    return;
  }
  const selectedKey = getSelectedKey(getState);
  dispatch(addFieldToHashRequest());
  try {
    await redis.addFieldToHashIfNotExists(selectedKey, fieldName, value);
    dispatch(addFieldToHashSuccess(fieldName, value));
  } catch (error) {
    dispatch(addFieldToHashFailure(error));
  }
};

/**
 * @returns {import('../store').Thunk}
 */
const setHashField = (fieldName, newValue) => async (dispatch, getState, { redis }) => {
  if (isSaving(getState())) {
    return;
  }
  const selectedKey = getSelectedKey(getState);
  dispatch(setHashFieldRequest());
  try {
    await redis.updateHashField(selectedKey, fieldName, newValue);
    dispatch(setHashFieldSuccess(fieldName, newValue));
  } catch (error) {
    dispatch(setHashFieldFailure(error));
  }
};

/**
 * @param {string} fieldToDelete 
 * @returns {import('../store').Thunk}
 */
const deleteFieldFromHash = fieldToDelete => async (dispatch, getState, { redis }) => {
  if (isSaving(getState())) {
    return;
  }
  const selectedKey = getSelectedKey(getState);
  dispatch(deleteFieldFromHashRequest());
  try {
    await redis.deleteFieldFromHash(selectedKey, fieldToDelete);
    dispatch(deleteFieldFromHashSuccess(fieldToDelete));
  } catch (error) {
    dispatch(deleteFieldFromHashFailure(error));
  }
};

const filterHashFieldsRequest = pattern => ({
  type: FILTER_HASH_FIELDS_REQUEST,
  payload: { pattern }
});

const filterHashFieldsSuccess = hash => ({
  type: FILTER_HASH_FIELDS_SUCCESS,
  payload: { hash }
});

const filterHashFieldsFailure = error => ({ type: FILTER_HASH_FIELDS_FAILURE, error });

const addFieldToHashRequest = () => ({ type: ADD_FIELD_TO_HASH_REQUEST });

const addFieldToHashSuccess = (fieldName, value) => ({
  type: ADD_FIELD_TO_HASH_SUCCESS,
  payload: { fieldName, value }
});

const addFieldToHashFailure = error => ({ type: ADD_FIELD_TO_HASH_FAILURE, error });

const setHashFieldRequest = () => ({ type: SET_HASH_FIELD_REQUEST });

const setHashFieldSuccess = (fieldName, newValue) => ({
  type: SET_HASH_FIELD_SUCCESS,
  payload: { fieldName, newValue }
});

const setHashFieldFailure = error => ({ type: SET_HASH_FIELD_FAILURE, error });

const deleteFieldFromHashRequest = () => ({ type: DELETE_FIELD_FROM_HASH_REQUEST });

const deleteFieldFromHashSuccess = fieldName => ({
  type: DELETE_FIELD_FROM_HASH_SUCCESS,
  payload: { fieldName }
});

const deleteFieldFromHashFailure = error => ({ type: DELETE_FIELD_FROM_HASH_FAILURE, error });

export const operations = {
  filterHashFields,
  addFieldToHash,
  setHashField,
  deleteFieldFromHash
};

export const actions = {
  filterHashFieldsRequest,
  filterHashFieldsSuccess,
  addFieldToHashSuccess,
  setHashFieldSuccess,
  deleteFieldFromHashSuccess
};

/**
 * @typedef {object} HashState
 * @prop {object} value
 * @prop {boolean} isLoading
 * @prop {boolean} isSaving
 * @prop {string} pattern
 */
const initialState = {
  value: {},
  isLoading: false,
  isSaving: false,
  pattern: ''
};

/**
 * @returns {HashState}
 */
export default function reducer(state = initialState, action) {
  switch (action.type) {
  case FILTER_HASH_FIELDS_REQUEST:
    return {
      ...state,
      isLoading: true,
      value: {},
      pattern: action.payload.pattern
    };
  case FILTER_HASH_FIELDS_SUCCESS:
    return {
      ...state,
      value: action.payload.hash,
      isLoading: false
    };
  case FILTER_HASH_FIELDS_FAILURE:
    return { ...state, isLoading: false };
  case ADD_FIELD_TO_HASH_REQUEST:
    return { ...state, isSaving: true };
  case ADD_FIELD_TO_HASH_SUCCESS:
    {
      const { fieldName, value } = action.payload;
      return {
        ...state,
        isSaving: false,
        value: {
          ...state.value,
          [fieldName]: value
        }
      }
    }
  case ADD_FIELD_TO_HASH_FAILURE:
    return { ...state, isSaving: false };
  case SET_HASH_FIELD_REQUEST:
    return { ...state, isSaving: true };
  case SET_HASH_FIELD_SUCCESS:
    {
      const { fieldName, newValue } = action.payload;
      return {
        ...state,
        isSaving: false,
        value: {
          ...state.value,
          [fieldName]: newValue
        }
      };
    }
  case SET_HASH_FIELD_FAILURE:
    return { ...state, isSaving: false };
  case DELETE_FIELD_FROM_HASH_REQUEST:
    return { ...state, isSaving: true };
  case DELETE_FIELD_FROM_HASH_SUCCESS:
    {
      const newHash = { ...state.value };
      delete newHash[action.payload.fieldName];
      return {
        ...state,
        isSaving: false,
        value: newHash
      };
    }    
  case DELETE_FIELD_FROM_HASH_FAILURE:
    return { ...state, isSaving: false };
  default:
    return state;
  }
}

/**
 * @typedef {import('../store').State} State
 * @param {State} state
 */
const isLoading = state => state.hash.isLoading;
/**
 * @param {State} state
 */
const isSaving = state => state.hash.isSaving;