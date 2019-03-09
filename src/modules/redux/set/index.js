// @ts-check
import { getSelectedKey } from '../shared';

const FILTER_SET_MEMBERS_REQUEST = 'redis-term/set/FILTER_SET_MEMBERS_REQUEST';
const FILTER_SET_MEMBERS_SUCCESS = 'redis-term/set/FILTER_SET_MEMBERS_SUCCESS';
const ADD_MEMBER_TO_SET_SUCCESS = 'redis-term/set/ADD_MEMBER_TO_SET_SUCCESS';
const UPDATE_SET_MEMBER_SUCCESS = 'redis-term/set/UPDATE_SET_MEMBER_SUCCESS';
const DELETE_MEMBER_FROM_SET_SUCCESS = 'redis-term/set/DELETE_MEMBER_FROM_SET_SUCCESS';

/**
 * @param {string} pattern 
 * @returns {import('../store').Thunk}
 */
const filterSetMembers = (pattern = '') => async (dispatch, getState, { redis }) => {
  const selectedKey = getSelectedKey(getState);
  dispatch(filterSetMembersRequest(pattern));
  const members = await redis.filterSetMembersStartWithPattern(selectedKey, pattern);
  dispatch(filterSetMembersSuccess(members));
};

/**
 * @param {string} newMember 
 * @returns {import('../store').Thunk}
 */
const addMemberToSet = newMember => async (dispatch, getState, { redis }) => {
  const selectedKey = getSelectedKey(getState);
  await redis.addMemberToSet(selectedKey, newMember);
  dispatch(addMemberToSetSuccess(newMember));
};

/**
 * @param {string} oldValue 
 * @param {string} newValue 
 * @returns {import('../store').Thunk}
 */
const updateSetMember = (oldValue, newValue) => async (dispatch, getState, { redis }) => {
  const selectedKey = getSelectedKey(getState);
  await redis.updateSetMemberIfNotExists(selectedKey, oldValue, newValue);
  dispatch(updateSetMemberSuccess(oldValue, newValue));
};

/**
 * @param {string} memberToDelete 
 * @returns {import('../store').Thunk}
 */
const deleteMemberFromSet = memberToDelete => async (dispatch, getState, { redis }) => {
  const selectedKey = getSelectedKey(getState);
  await redis.deleteMemberFromSet(selectedKey, memberToDelete);
  dispatch(deleteMemberFromSetSuccess(memberToDelete));
};

const filterSetMembersRequest = pattern => ({
  type: FILTER_SET_MEMBERS_REQUEST,
  payload: { pattern }
});

const filterSetMembersSuccess = members => ({
  type: FILTER_SET_MEMBERS_SUCCESS,
  payload: { members }
});

const addMemberToSetSuccess = newMember => ({
  type: ADD_MEMBER_TO_SET_SUCCESS,
  payload: { newMember }
});

const updateSetMemberSuccess = (oldValue, newValue) => ({
  type: UPDATE_SET_MEMBER_SUCCESS,
  payload: { oldValue, newValue }
});

const deleteMemberFromSetSuccess = member => ({
  type: DELETE_MEMBER_FROM_SET_SUCCESS,
  payload: { member }
});

/**
 * @typedef {object} SetState
 * @prop {boolean} isLoading
 * @prop {string[]} members
 * @prop {string} pattern
 */
const initialState = {
  isLoading: true,
  members: [],
  pattern: ''
};

export const operations = {
  addMemberToSet,
  updateSetMember,
  deleteMemberFromSet,
  filterSetMembers
};

export const actions = {
  filterSetMembersRequest,
  filterSetMembersSuccess,
  addMemberToSetSuccess,
  updateSetMemberSuccess,
  deleteMemberFromSetSuccess
};

/**
 * @param {SetState} state 
 * @param {*} action 
 * @returns {SetState}
 */
export default function reducer(state = initialState, action) {
  switch (action.type) {
  case FILTER_SET_MEMBERS_REQUEST:
    return {
      ...state,
      pattern: action.payload.pattern,
      isLoading: true,
      members: []
    };
  case FILTER_SET_MEMBERS_SUCCESS:
    return {
      ...state,
      isLoading: false,
      members: action.payload.members
    };
  case ADD_MEMBER_TO_SET_SUCCESS:
    return {
      ...state,
      members: state.members.concat(action.payload.newMember)
    };
  case UPDATE_SET_MEMBER_SUCCESS:
    {
      const { oldValue, newValue } = action.payload;
      const oldValueIndex = state.members.indexOf(oldValue);
      return {
        ...state,
        members: state.members.map((x, index) => index === oldValueIndex
          ? newValue
          : x)
      };
    }
  case DELETE_MEMBER_FROM_SET_SUCCESS:
    {
      const index = state.members.indexOf(action.payload.member);
      const newMembers = state.members.slice(0);
      newMembers.splice(index, 1);
      return {
        ...state,
        members: newMembers
      };
    }
  default:
    return state;
  }
}
