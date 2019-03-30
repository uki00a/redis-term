// @ts-check
import assert from 'assert';
import { getSelectedKey } from '../shared';

const GET_SET_MEMBERS_REQUEST = 'redis-term/set/GET_SET_MEMBERS_REQUEST';
const GET_SET_MEMBERS_SUCCESS = 'redis-term/set/GET_SET_MEMBERS_SUCCESS';
const GET_SET_MEMBERS_FAILURE = 'redis-term/set/GET_SET_MEMBERS_FAILURE';
const ADD_MEMBER_TO_SET_REQUEST = 'redis-term/set/ADD_MEMBER_TO_SET_REQUEST';
const ADD_MEMBER_TO_SET_SUCCESS = 'redis-term/set/ADD_MEMBER_TO_SET_SUCCESS';
const ADD_MEMBER_TO_SET_FAILURE = 'redis-term/set/ADD_MEMBER_TO_SET_FAILURE';
const DELETE_MEMBER_FROM_SET_REQUEST = 'redis-term/set/DELETE_MEMBER_FROM_SET_REQUEST';
const DELETE_MEMBER_FROM_SET_SUCCESS = 'redis-term/set/DELETE_MEMBER_FROM_SET_SUCCESS';
const DELETE_MEMBER_FROM_SET_FAILURE = 'redis-term/set/DELETE_MEMBER_FROM_SET_FAILURE';

/**
 * @param {string} pattern 
 * @returns {import('../store').Thunk}
 */
const getSetMembers = (pattern = '') => async (dispatch, getState, { redis }) => {
  if (isLoading(getState())) {
    return;
  }
  const selectedKey = getSelectedKey(getState);
  dispatch(getSetMembersRequest(pattern));
  try {
    const members = await redis.getSetMembersStartWithPattern(selectedKey, pattern);
    dispatch(getSetMembersSuccess(members));
  } catch (error) {
    dispatch(getSetMembersFailure(error));
  }
};

/**
 * @param {string} newMember 
 * @returns {import('../store').Thunk}
 */
const addMemberToSet = newMember => async (dispatch, getState, { redis }) => {
  if (isSaving(getState())) {
    return;
  }
  const selectedKey = getSelectedKey(getState);
  dispatch(addMemberToSetRequest());
  try {
    await redis.addMemberToSetIfNotExists(selectedKey, newMember);
    dispatch(addMemberToSetSuccess(newMember));
  } catch (error) {
    dispatch(addMemberToSetFailure(error));
  }
};

/**
 * @param {string} memberToDelete 
 * @returns {import('../store').Thunk}
 */
const deleteMemberFromSet = memberToDelete => async (dispatch, getState, { redis }) => {
  if (isSaving(getState())) {
    return;
  }
  const selectedKey = getSelectedKey(getState);
  dispatch(deleteMemberFromSetRequest());
  try {
    await redis.deleteMemberFromSet(selectedKey, memberToDelete);
    dispatch(deleteMemberFromSetSuccess(memberToDelete));
  } catch (error) {
    dispatch(deleteMemberFromSetFailure(error));
  }
};

const getSetMembersRequest = pattern => ({
  type: GET_SET_MEMBERS_REQUEST,
  payload: { pattern }
});
const getSetMembersSuccess = members => ({
  type: GET_SET_MEMBERS_SUCCESS,
  payload: { members }
});
const getSetMembersFailure = error => ({ type: GET_SET_MEMBERS_FAILURE, error });

const addMemberToSetRequest = () => ({ type: ADD_MEMBER_TO_SET_REQUEST });
const addMemberToSetSuccess = newMember => ({
  type: ADD_MEMBER_TO_SET_SUCCESS,
  payload: { newMember }
});
const addMemberToSetFailure = error => ({ type: ADD_MEMBER_TO_SET_FAILURE, error });

const deleteMemberFromSetRequest = () => ({ type: DELETE_MEMBER_FROM_SET_REQUEST });
const deleteMemberFromSetSuccess = member => ({
  type: DELETE_MEMBER_FROM_SET_SUCCESS,
  payload: { member }
});
const deleteMemberFromSetFailure = error => ({ type: DELETE_MEMBER_FROM_SET_FAILURE, error });

/**
 * @typedef {object} SetState
 * @prop {boolean} isLoading
 * @prop {boolean} isSaving
 * @prop {string[]} members
 * @prop {string} pattern
 */
const initialState = {
  isLoading: false,
  isSaving: false,
  members: [],
  pattern: ''
};

export const operations = {
  addMemberToSet,
  deleteMemberFromSet,
  getSetMembers
};

export const actions = {
  getSetMembersRequest,
  getSetMembersSuccess,
  addMemberToSetSuccess,
  deleteMemberFromSetSuccess
};

/**
 * @param {SetState} state 
 * @param {*} action 
 * @returns {SetState}
 */
export default function reducer(state = initialState, action) {
  switch (action.type) {
  case GET_SET_MEMBERS_REQUEST:
    return {
      ...state,
      pattern: action.payload.pattern,
      isLoading: true,
      members: []
    };
  case GET_SET_MEMBERS_SUCCESS:
    return {
      ...state,
      isLoading: false,
      members: action.payload.members
    };
  case GET_SET_MEMBERS_FAILURE:
    return { ...state, isLoading: false };
  case ADD_MEMBER_TO_SET_REQUEST:
    return { ...state, isSaving: true };
  case ADD_MEMBER_TO_SET_SUCCESS:
    assert(state.members.indexOf(action.payload.newMember) === -1, 'duplicate value should not be added');
    return {
      ...state,
      isSaving: false,
      members: state.members.concat(action.payload.newMember)
    };
  case ADD_MEMBER_TO_SET_FAILURE:
    return { ...state, isSaving: false };
  case DELETE_MEMBER_FROM_SET_REQUEST:
    return { ...state, isSaving: true };
  case DELETE_MEMBER_FROM_SET_SUCCESS:
    {
      const index = state.members.indexOf(action.payload.member);
      const newMembers = state.members.slice(0);
      newMembers.splice(index, 1);
      return {
        ...state,
        isSaving: false,
        members: newMembers
      };
    }
  case DELETE_MEMBER_FROM_SET_FAILURE:
    return { ...state, isSaving: false };
  default:
    return state;
  }
}

/**
 * @typedef {import('../store').State} State 
 * @param {State} state
 */
const isLoading = state => state.set.isLoading;
/**
 * 
 * @param {State} state 
 */
const isSaving = state => state.set.isSaving;