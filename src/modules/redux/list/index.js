// @ts-check
import { getSelectedKey } from '../shared';

const LOAD_LIST_ELEMENTS_REQUEST = 'redis-term/list/LOAD_LIST_ELEMENTS_REQUEST';
const LOAD_LIST_ELEMENTS_SUCCESS = 'redis-term/list/LOAD_LIST_ELEMENTS_SUCCESS';
const ADD_ELEMENT_TO_LIST_SUCCESS = 'redis-term/list/ADD_ELEMENT_TO_LIST_SUCCESS';
const UPDATE_LIST_ELEMENT_SUCCESS = 'redis-term/list/UPDATE_LIST_ELEMENT_SUCCESS';
/**
 * @returns {import('../store').Thunk}
 */
const loadListElements = () => async (dispatch, getState, { redis }) => {
  const selectedKey = getSelectedKey(getState);
  dispatch(loadListElementsRequest());
  const elements = await redis.loadListElements(selectedKey);
  dispatch(loadListElementsSuccess(elements));
};

/**
 * @param {*} newElement 
 * @returns {import('../store').Thunk}
 */
const addElementToList = newElement => async (dispatch, getState, { redis }) => {
  const selectedKey = getSelectedKey(getState);
  await redis.addElementToList(selectedKey, newElement);
  dispatch(addElementToListSuccess(newElement));
};

/**
 * @param {number} index
 * @param {string} newValue
 * @returns {import('../store').Thunk}
 */
const updateListElement = (index, newValue) => async (dispatch, getState, { redis }) => {
  const keyName = getSelectedKey(getState);
  await redis.updateListElement(keyName, index, newValue);
  dispatch(updateListElementSuccess(index, newValue));
};

const loadListElementsRequest = () => ({
  type: LOAD_LIST_ELEMENTS_REQUEST
});

const loadListElementsSuccess = elements => ({
  type: LOAD_LIST_ELEMENTS_SUCCESS,
  payload: { elements }
});

const addElementToListSuccess = newElement => ({
  type: ADD_ELEMENT_TO_LIST_SUCCESS,
  payload: { newElement }
});

const updateListElementSuccess = (index, newValue) => ({
  type: UPDATE_LIST_ELEMENT_SUCCESS,
  payload: { index, newValue }
});

/**
 * @typedef {object} ListState
 * @prop {boolean} isLoading
 * @prop {string[]} elements
 */
const initialState = {
  isLoading: true,
  elements: []
};

export const operations = {
  loadListElements,
  addElementToList,
  updateListElement
};

export const actions = {
  loadListElementsRequest,
  loadListElementsSuccess,
  addElementToListSuccess,
  updateListElementSuccess
};

/**
 * @param {ListState} state 
 * @param {object} action 
 * @returns {ListState}
 */
export default function reducer(state = initialState, action) {
  switch (action.type) {
  case LOAD_LIST_ELEMENTS_REQUEST:
    return {
      ...state,
      isLoading: true,
      elements: []
    };
  case LOAD_LIST_ELEMENTS_SUCCESS:
    return {
      ...state,
      isLoading: false, 
      elements: action.payload.elements
    };
  case ADD_ELEMENT_TO_LIST_SUCCESS:
    return {
      ...state,
      elements: state.elements.concat(action.payload.newElement)
    };
  case UPDATE_LIST_ELEMENT_SUCCESS:
    return {
      ...state,
      elements: state.elements.map((x, index) => index === action.payload.index
        ? action.payload.newValue
        : x)
    };
  default:
    return state;
  }
}