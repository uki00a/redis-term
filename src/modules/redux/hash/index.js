// @ts-check
import { getSelectedKey } from '../shared';

const FILTER_HASH_FIELDS_REQUEST = 'redis-term/hash/FILTER_HASH_FIELDS_REQUEST';
const FILTER_HASH_FIELDS_SUCCESS = 'redis-term/hash/FILTER_HASH_FIELDS_SUCCESS';
const SET_HASH_FIELD_SUCCESS = 'redis-term/hash/SET_HASH_FIELD_SUCCESS';
const DELETE_FIELD_FROM_HASH_SUCCESS = 'redis-term/hash/DELETE_FIELD_FROM_HASH_SUCCESS';

/**
 * @param {string} pattern 
 * @returns {import('../store').Thunk}
 */
const filterHashFields = (pattern = '') => async (dispatch, getState, { redis }) => {
  const selectedKey = getSelectedKey(getState);
  dispatch(filterHashFieldsRequest(pattern));
  const hash = await redis.filterHashFieldsStartWithPattern(selectedKey, pattern);
  dispatch(filterHashFieldsSuccess(hash));
};

/**
 * @returns {import('../store').Thunk}
 */
const setHashField = (fieldName, newValue) => async (dispatch, getState, { redis }) => {
  const selectedKey = getSelectedKey(getState);
  await redis.updateHashField(selectedKey, fieldName, newValue);
  dispatch(setHashFieldSuccess(fieldName, newValue));
};

/**
 * @param {string} fieldToDelete 
 * @returns {import('../store').Thunk}
 */
const deleteFieldFromHash = fieldToDelete => async (dispatch, getState, { redis }) => {
  const selectedKey = getSelectedKey(getState);
  await redis.deleteFieldFromHash(selectedKey, fieldToDelete);
  dispatch(deleteFieldFromHashSuccess(fieldToDelete));
};

const filterHashFieldsRequest = pattern => ({
  type: FILTER_HASH_FIELDS_REQUEST,
  payload: { pattern }
});

const filterHashFieldsSuccess = hash => ({
  type: FILTER_HASH_FIELDS_SUCCESS,
  payload: { hash }
});

const setHashFieldSuccess = (fieldName, newValue) => ({
  type: SET_HASH_FIELD_SUCCESS,
  payload: { fieldName, newValue }
});

const deleteFieldFromHashSuccess = fieldName => ({
  type: DELETE_FIELD_FROM_HASH_SUCCESS,
  payload: { fieldName }
});

export const operations = {
  filterHashFields,
  setHashField,
  deleteFieldFromHash
};

export const actions = {
  filterHashFieldsRequest,
  filterHashFieldsSuccess,
  setHashFieldSuccess,
  deleteFieldFromHashSuccess
};

/**
 * @typedef {object} HashState
 * @prop {object} value
 * @prop {boolean} isLoading
 * @prop {string} pattern
 */
const initialState = {
  value: {},
  isLoading: true,
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
  case SET_HASH_FIELD_SUCCESS:
    {
      const { fieldName, newValue } = action.payload;
      return {
        ...state,
        value: {
          ...state.value,
          [fieldName]: newValue
        }
      };
    }
  case DELETE_FIELD_FROM_HASH_SUCCESS:
    {
      const newHash = { ...state.value };
      delete newHash[action.payload.fieldName];
      return {
        ...state,
        value: newHash
      };
    }    
  default:
    return state;
  }
}