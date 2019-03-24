// @ts-check
import has from 'lodash/has';
import get from 'lodash/get';
import { ApplicationError } from '../../errors';

const SHOW_ERROR = 'redis-term/error/SHOW_ERROR';
const CLEAR_ERROR = 'redis-term/error/CLEAR_ERROR';

const showError = error => {
  const text = formatError(error);

  return {
    type: SHOW_ERROR,
    payload: { message: text }
  };
};
const clearError = () => ({ type: CLEAR_ERROR });

const formatError = error => {
  if (ApplicationError.isPrototypeOf(get(error, 'constructor'))) {
    return error.message;
  } else if (has(error, 'stack')) {
    return error.stack;
  } else {
    return error.toString();
  }
};

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