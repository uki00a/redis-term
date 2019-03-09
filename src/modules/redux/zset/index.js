// @ts-check
import { getSelectedKey } from '../shared';

const FILTER_ZSET_MEMBERS_REQUEST = 'redis-term/zset/FILTER_ZSET_MEMBERS_REQUEST';
const FILTER_ZSET_MEMBERS_SUCCESS = 'redis-term/zset/FILTER_ZSET_MEMBERS_SUCCESS';
const UPDATE_ZSET_MEMBER_SUCCESS = 'redis-term/zset/UPDATE_ZSET_MEMBER_SUCCESS';
const ADD_MEMBER_TO_ZSET_SUCCESS = 'redis-term/zset/ADD_MEMBER_TO_ZSET_SUCCESS';
const DELETE_MEMBER_FROM_ZSET_SUCCESS = 'redis-term/zset/DELETE_MEMBER_FROM_ZSET';

/**
 * @param {string} pattern 
 * @returns {import('../store').Thunk}
 */
const filterZsetMembers = (pattern = '') => async (dispatch, getState, { redis }) => {
  const selectedKey = getSelectedKey(getState);
  dispatch(filterZsetMembersRequest(pattern));
  const [members, scores] = await redis.filterZsetMembersStartWithPattern(selectedKey, pattern);
  dispatch(filterZsetMembersSuccess(members, scores));
};

/**
 * @param {string} oldValue
 * @param {string} newValue
 * @param {number} newScore
 * @returns {import('../store').Thunk}
 */
const updateZsetMember = (oldValue, newValue, newScore) => async (dispatch, getState, { redis }) => {
  const selectedKey = getSelectedKey(getState);
  await redis.updateZsetMember(selectedKey, oldValue, newValue, newScore);
  dispatch(updateZsetMemberSuccess(oldValue, newValue, newScore));
};

/**
 * @param {string} newMember 
 * @param {number} score 
 * @returns {import('../store').Thunk}
 */
const addMemberToZset = (newMember, score) => async (dispatch, getState, { redis }) => {
  const selectedKey = getSelectedKey(getState);
  await redis.addMemberToZset(selectedKey, newMember, score);
  dispatch(addMemberToZsetSuccess(newMember, score));
};

/**
 * @param {string} memberToDelete
 * @returns {import('../store').Thunk}
 */
const deleteMemberFromZset = memberToDelete => async (dispatch, getState, { redis }) => {
  const selectedKey = getSelectedKey(getState);
  await redis.deleteMemberFromZset(selectedKey, memberToDelete);
  dispatch(deleteMemberFromZsetSuccess(memberToDelete));
};

const filterZsetMembersRequest = pattern => ({
  type: FILTER_ZSET_MEMBERS_REQUEST,
  payload: { pattern }
});

/**
 * @param {string[]} members
 * @param {number[]} scores
 */
const filterZsetMembersSuccess = (members, scores) => ({
  type: FILTER_ZSET_MEMBERS_SUCCESS,
  payload: { members, scores }
});

/**
 * @param {string} oldValue 
 * @param {string} newValue 
 * @param {number} newScore 
 */
const updateZsetMemberSuccess = (oldValue, newValue, newScore) => ({
  type: UPDATE_ZSET_MEMBER_SUCCESS,
  payload: { oldValue, newValue, newScore }
});

/**
 * @param {string} newMember 
 * @param {number} score 
 */
const addMemberToZsetSuccess = (newMember, score) => ({
  type: ADD_MEMBER_TO_ZSET_SUCCESS,
  payload: { newMember, score }
});

const deleteMemberFromZsetSuccess = member => ({
  type: DELETE_MEMBER_FROM_ZSET_SUCCESS,
  payload: { member }
});

/**
 * @typedef {object} ZsetState
 * @prop {string[]} members
 * @prop {number[]} scores
 * @prop {boolean} isLoading
 * @prop {string} pattern
 */
const initialState = {
  members: [],
  scores: [],
  isLoading: true,
  pattern: ''
};

export const operations = {
  filterZsetMembers,
  updateZsetMember,
  addMemberToZset,
  deleteMemberFromZset
};

export const actions = {
  filterZsetMembersRequest,
  filterZsetMembersSuccess,
  updateZsetMemberSuccess,
  addMemberToZsetSuccess,
  deleteMemberFromZsetSuccess
};

/**
 * @param {ZsetState} state 
 * @param {*} action 
 * @returns {ZsetState}
 */
export default function reducer(state = initialState, action) {
  switch (action.type) {
  case FILTER_ZSET_MEMBERS_REQUEST:
    return {
      ...state,
      isLoading: true,
      pattern: action.payload.pattern
    };
  case FILTER_ZSET_MEMBERS_SUCCESS:
    return {
      ...state,
      isLoading: false,
      members: action.payload.members,
      scores: action.payload.scores
    };
  case UPDATE_ZSET_MEMBER_SUCCESS:
    {
      const { oldValue, newValue, newScore } = action.payload;
      const oldValueIndex = state.members.indexOf(oldValue);
      return {
        ...state,
        members: state.members.map((x, index) => index === oldValueIndex
          ? newValue
          : x),
        scores: state.scores.map((x, index) => index === oldValueIndex
          ? newScore
          : x)
      };
    }
  case ADD_MEMBER_TO_ZSET_SUCCESS:
    {
      const { newMember, score } = action.payload;
      const newValueIndex = state.members.indexOf(newMember);
      if (newValueIndex === -1) {
        return {
          ...state,
          members: [newMember].concat(state.members),
          scores: [score].concat(state.scores)   
        };
      } else {
        return {
          ...state,
          scores: state.scores.map((x, index) => index === newValueIndex
            ? score
            : x)
        };
      }
    }
  case DELETE_MEMBER_FROM_ZSET_SUCCESS:
    {
      const deletedMemberIndex = state.members.indexOf(action.payload.member);
      const newMembers = state.members.slice(0);
      const newScores = state.scores.slice(0);
      newMembers.splice(deletedMemberIndex, 1);
      newScores.splice(deletedMemberIndex, 1);      
      return {
        ...state,
        members: newMembers,
        scores: newScores
      };
    }
  default:
    return state;
  } 
}