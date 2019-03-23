// @ts-check
import { getSelectedKey } from '../shared';

const LOAD_LIST_ELEMENTS_REQUEST = 'redis-term/list/LOAD_LIST_ELEMENTS_REQUEST';
const LOAD_LIST_ELEMENTS_SUCCESS = 'redis-term/list/LOAD_LIST_ELEMENTS_SUCCESS';
const LOAD_LIST_ELEMENTS_FAILURE = 'redis-term/list/LOAD_LIST_ELEMENTS_FAILURE';
const ADD_ELEMENT_TO_LIST_REQUEST = 'redis-term/list/ADD_ELEMENT_TO_LIST_REQUEST';
const ADD_ELEMENT_TO_LIST_SUCCESS = 'redis-term/list/ADD_ELEMENT_TO_LIST_SUCCESS';
const ADD_ELEMENT_TO_LIST_FAILURE = 'redis-term/list/ADD_ELEMENT_TO_LIST_FAILURE';
const UPDATE_LIST_ELEMENT_REQUEST = 'redis-term/list/UPDATE_LIST_ELEMENT_REQUEST';
const UPDATE_LIST_ELEMENT_SUCCESS = 'redis-term/list/UPDATE_LIST_ELEMENT_SUCCESS';
const UPDATE_LIST_ELEMENT_FAILURE = 'redis-term/list/UPDATE_LIST_ELEMENT_FAILURE';

/**
 * @returns {import('../store').Thunk}
 */
const loadListElements = () => async (dispatch, getState, { redis }) => {
  if (isLoading(getState())) {
    return;
  }
  const selectedKey = getSelectedKey(getState);
  dispatch(loadListElementsRequest());
  try {
    const elements = await redis.loadListElements(selectedKey);
    dispatch(loadListElementsSuccess(elements));
  } catch (error) {
    dispatch(loadListElementsFailure(error));
  }
};

/**
 * @param {*} newElement 
 * @returns {import('../store').Thunk}
 */
const addElementToList = newElement => async (dispatch, getState, { redis }) => {
  if (isSaving(getState())) {
    return;
  }
  dispatch(addElementToListRequest());
  const selectedKey = getSelectedKey(getState);
  try {
    await redis.addElementToList(selectedKey, newElement);
    dispatch(addElementToListSuccess(newElement));
  } catch (error) {
    dispatch(addElementToListFailure(error));
  }
};

/**
 * @param {number} index
 * @param {string} newValue
 * @returns {import('../store').Thunk}
 */
const updateListElement = (index, newValue) => async (dispatch, getState, { redis }) => {
  if (isSaving(getState())) {
    return;
  }
  updateListElementRequest();
  const keyName = getSelectedKey(getState);
  try {
  await redis.updateListElement(keyName, index, newValue);
  dispatch(updateListElementSuccess(index, newValue));
  } catch (error) {
    dispatch(updateListElementFailure(error));
  }
};

const loadListElementsRequest = () => ({
  type: LOAD_LIST_ELEMENTS_REQUEST
});
const loadListElementsSuccess = elements => ({
  type: LOAD_LIST_ELEMENTS_SUCCESS,
  payload: { elements }
});
const loadListElementsFailure = error => ({ type: LOAD_LIST_ELEMENTS_FAILURE, error });

const addElementToListRequest = () => ({ type: ADD_ELEMENT_TO_LIST_REQUEST });
const addElementToListSuccess = newElement => ({
  type: ADD_ELEMENT_TO_LIST_SUCCESS,
  payload: { newElement }
});
const addElementToListFailure = error => ({ type: ADD_ELEMENT_TO_LIST_FAILURE, error });

const updateListElementRequest = () => ({ type: UPDATE_LIST_ELEMENT_REQUEST });
const updateListElementSuccess = (index, newValue) => ({
  type: UPDATE_LIST_ELEMENT_SUCCESS,
  payload: { index, newValue }
});
const updateListElementFailure = error => ({ type: UPDATE_LIST_ELEMENT_FAILURE, error });

/**
 * @typedef {object} ListState
 * @prop {boolean} isLoading
 * @prop {string[]} elements
 * @prop {boolean} isSaving
 */
const initialState = {
  isLoading: false,
  isSaving: false,
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
  case LOAD_LIST_ELEMENTS_FAILURE:
    return { ...state, isLoading: false };
  case ADD_ELEMENT_TO_LIST_REQUEST:
    return { ...state, isSaving: true };
  case ADD_ELEMENT_TO_LIST_SUCCESS:
    return {
      ...state,
      isSaving: false,
      elements: state.elements.concat(action.payload.newElement)
    };
  case ADD_ELEMENT_TO_LIST_FAILURE:
    return { ...state, isSaving: false };
  case UPDATE_LIST_ELEMENT_REQUEST:
    return { ...state, isSaving: true };
  case UPDATE_LIST_ELEMENT_SUCCESS:
    return {
      ...state,
      isSaving: false,
      elements: state.elements.map((x, index) => index === action.payload.index
        ? action.payload.newValue
        : x)
    };
  case UPDATE_LIST_ELEMENT_FAILURE:
    return { ...state, isSaving: false };
  default:
    return state;
  }
}

/**
 * @typedef {import('../store').State} State
 */
/** @param {State} state */
const isLoading = state => state.list.isLoading;
/** @param {State} state */
const isSaving = state => state.list.isSaving;
