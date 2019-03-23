// @ts-check
import has from 'lodash/has';

const SHOW_ERROR = 'redis-term/error/SHOW_ERROR';
const CLEAR_ERROR = 'redis-term/error/CLEAR_ERROR';

const showError = error => {
  const text = has(error, 'stack')
    ? error.stack
    : error.toString();

  return {
    type: SHOW_ERROR,
    payload: { message: text }
  };
};
const clearError = () => ({ type: CLEAR_ERROR });

/**
 * @typedef {object} ErrorState
 * @prop {string} [message]
 */
const initialState = { message: null };

export const actions = { showError, clearError };

/**
 * @param {ErrorState} state 
 * @param {*} action 
 * @returns {ErrorState}
 */
export default function reducer(state = initialState, action) {
  switch (action.type) {
  case SHOW_ERROR:
    return { message: action.payload.message };
  case CLEAR_ERROR:
    return { message: null };
  default:
    return state;
  }
}