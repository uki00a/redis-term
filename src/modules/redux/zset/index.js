// @ts-check
import { getSelectedKey } from '../shared';

const FILTER_ZSET_MEMBERS_REQUEST = 'redis-term/zset/FILTER_ZSET_MEMBERS_REQUEST';
const FILTER_ZSET_MEMBERS_SUCCESS = 'redis-term/zset/FILTER_ZSET_MEMBERS_SUCCESS';
const FILTER_ZSET_MEMBERS_FAILURE = 'redis-term/zset/FILTER_ZSET_MEMBERS_FAILURE';
const UPDATE_ZSET_MEMBER_REQUEST = 'redis-term/zset/UPDATE_ZSET_MEMBER_REQUEST';
const UPDATE_ZSET_MEMBER_SUCCESS = 'redis-term/zset/UPDATE_ZSET_MEMBER_SUCCESS';
const UPDATE_ZSET_MEMBER_FAILURE = 'redis-term/zset/UPDATE_ZSET_MEMBER_FAILURE';
const ADD_MEMBER_TO_ZSET_REQUEST = 'redis-term/zset/ADD_MEMBER_TO_ZSET_REQUEST';
const ADD_MEMBER_TO_ZSET_SUCCESS = 'redis-term/zset/ADD_MEMBER_TO_ZSET_SUCCESS';
const ADD_MEMBER_TO_ZSET_FAILURE = 'redis-term/zset/ADD_MEMBER_TO_ZSET_FAILURE';
const DELETE_MEMBER_FROM_ZSET_REQUEST = 'redis-term/zset/DELETE_MEMBER_FROM_ZSET_REQUEST';
const DELETE_MEMBER_FROM_ZSET_SUCCESS = 'redis-term/zset/DELETE_MEMBER_FROM_ZSET_SUCCESS';
const DELETE_MEMBER_FROM_ZSET_FAILURE = 'redis-term/zset/DELETE_MEMBER_FROM_ZSET_FAILURE';

/**
 * @param {string} pattern 
 * @returns {import('../store').Thunk}
 */
const filterZsetMembers = (pattern = '') => async (dispatch, getState, { redis }) => {
  if (isLoading(getState())) {
    return;
  }
  const selectedKey = getSelectedKey(getState);
  dispatch(filterZsetMembersRequest(pattern));
  try {
    const [members, scores] = await redis.filterZsetMembersStartWithPattern(selectedKey, pattern);
    dispatch(filterZsetMembersSuccess(members, scores));
  } catch (error) {
    dispatch(filterZsetMembersFailure(error));
  }
};

/**
 * @param {string} oldValue
 * @param {string} newValue
 * @param {number} newScore
 * @returns {import('../store').Thunk}
 */
const updateZsetMember = (oldValue, newValue, newScore) => async (dispatch, getState, { redis }) => {
  if (isSaving(getState())) {
    return;
  }
  const selectedKey = getSelectedKey(getState);
  dispatch(updateZsetMemberRequest());
  try {
    await redis.updateZsetMember(selectedKey, oldValue, newValue, newScore);
    dispatch(updateZsetMemberSuccess(oldValue, newValue, newScore));
  } catch (error) {
    dispatch(updateZsetMemberFailure(error));
  }
};

/**
 * @param {string} newMember 
 * @param {number} score 
 * @returns {import('../store').Thunk}
 */
const addMemberToZset = (newMember, score) => async (dispatch, getState, { redis }) => {
  if (isSaving(getState())) {
    return;
  }
  const selectedKey = getSelectedKey(getState);
  dispatch(addMemberToZsetRequest());
  try {
    await redis.addMemberToZset(selectedKey, newMember, score);
    dispatch(addMemberToZsetSuccess(newMember, score));
  } catch (error) {
    dispatch(addMemberToZsetFailure(error));
  }
};

/**
 * @param {string} memberToDelete
 * @returns {import('../store').Thunk}
 */
const deleteMemberFromZset = memberToDelete => async (dispatch, getState, { redis }) => {
  if (isSaving(getState())) {
    return;
  }
  const selectedKey = getSelectedKey(getState);
  dispatch(deleteMemberFromZsetRequest());
  try {
    await redis.deleteMemberFromZset(selectedKey, memberToDelete);
    dispatch(deleteMemberFromZsetSuccess(memberToDelete));
  } catch (error) {
    dispatch(deleteMemberFromZsetFailure(error));
  }
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

const filterZsetMembersFailure = error => ({ type: FILTER_ZSET_MEMBERS_FAILURE, error });

const updateZsetMemberRequest = () => ({ type: UPDATE_ZSET_MEMBER_REQUEST });
/**
 * @param {string} oldValue 
 * @param {string} newValue 
 * @param {number} newScore 
 */
const updateZsetMemberSuccess = (oldValue, newValue, newScore) => ({
  type: UPDATE_ZSET_MEMBER_SUCCESS,
  payload: { oldValue, newValue, newScore }
});
const updateZsetMemberFailure = error => ({ type: UPDATE_ZSET_MEMBER_FAILURE, error });

const addMemberToZsetRequest = () => ({ type: ADD_MEMBER_TO_ZSET_REQUEST });
/**
 * @param {string} newMember 
 * @param {number} score 
 */
const addMemberToZsetSuccess = (newMember, score) => ({
  type: ADD_MEMBER_TO_ZSET_SUCCESS,
  payload: { newMember, score }
});
const addMemberToZsetFailure = error => ({ type: ADD_MEMBER_TO_ZSET_FAILURE, error });

const deleteMemberFromZsetRequest = () => ({ type: DELETE_MEMBER_FROM_ZSET_REQUEST });
const deleteMemberFromZsetSuccess = member => ({
  type: DELETE_MEMBER_FROM_ZSET_SUCCESS,
  payload: { member }
});
const deleteMemberFromZsetFailure = error => ({ type: DELETE_MEMBER_FROM_ZSET_FAILURE, error });

/**
 * @typedef {object} ZsetState
 * @prop {string[]} members
 * @prop {number[]} scores
 * @prop {boolean} isLoading
 * @prop {boolean} isSaving
 * @prop {string} pattern
 */
const initialState = {
  members: [],
  scores: [],
  isLoading: false,
  isSaving: false,
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
  case FILTER_ZSET_MEMBERS_FAILURE:
    return { ...state, isLoading: false };
  case UPDATE_ZSET_MEMBER_REQUEST:
    return { ...state, isSaving: true };
  case UPDATE_ZSET_MEMBER_SUCCESS:
    {
      // TODO refactor
      const { oldValue, newValue, newScore } = action.payload;
      if (state.members.indexOf(newValue) > -1) {
        const oldValueIndex = state.members.indexOf(oldValue);
        const newMembers = state.members.slice(0);
        const newScores = state.scores.slice(0);
        newMembers.splice(oldValueIndex, 1);
        newScores.splice(oldValueIndex, 1);
        newScores[state.members.indexOf(newValue)] = newScore;
        return {
          ...state,
          isSaving: false,
          members: newMembers,
          scores: newScores
        };
      } else {
        const oldValueIndex = state.members.indexOf(oldValue);
        return {
          ...state,
          isSaving: false,
          members: state.members.map((x, index) => index === oldValueIndex
            ? newValue
            : x),
          scores: state.scores.map((x, index) => index === oldValueIndex
            ? newScore
            : x)
        };
      }
    }
  case UPDATE_ZSET_MEMBER_FAILURE:
    return { ...state, isSaving: false };
  case ADD_MEMBER_TO_ZSET_REQUEST:
    return { ...state, isSaving: true };
  case ADD_MEMBER_TO_ZSET_SUCCESS:
    {
      const { newMember, score } = action.payload;
      const newValueIndex = state.members.indexOf(newMember);
      if (newValueIndex === -1) {
        return {
          ...state,
          isSaving: false,
          members: [newMember].concat(state.members),
          scores: [score].concat(state.scores)   
        };
      } else {
        return {
          ...state,
          isSaving: false,
          scores: state.scores.map((x, index) => index === newValueIndex
            ? score
            : x)
        };
      }
    }
  case DELETE_MEMBER_FROM_ZSET_REQUEST:
    return { ...state, isSaving: true };
  case DELETE_MEMBER_FROM_ZSET_SUCCESS:
    {
      const deletedMemberIndex = state.members.indexOf(action.payload.member);
      const newMembers = state.members.slice(0);
      const newScores = state.scores.slice(0);
      newMembers.splice(deletedMemberIndex, 1);
      newScores.splice(deletedMemberIndex, 1);      
      return {
        ...state,
        isSaving: false,
        members: newMembers,
        scores: newScores
      };
    }
  case DELETE_MEMBER_FROM_ZSET_FAILURE:
    return { ...state, isSaving: false };
  default:
    return state;
  } 
}

/** 
 * @typedef {import('../store').State} State
 * @param {State} state
 */
const isLoading = state => state.zset.isLoading;
/**
 * @param {State} state
 */
const isSaving = state => state.zset.isSaving;