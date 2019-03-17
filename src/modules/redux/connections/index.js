// @ts-check
import * as api from '../../connections';

const LOAD_CONNECTIONS_SUCCESS = 'redis-term/connections/LOAD_CONNECTIONS_SUCCESS';
const ADD_CONNECTION_REQUEST = 'redis-term/connections/ADD_CONNECTION_REQUEST';
const ADD_CONNECTION_SUCCESS = 'redis-term/connections/ADD_CONNECTION_SUCCESS';
const UPDATE_CONNECTION_REQUEST = 'redis-term/connections/UPDATE_CONNECTION_REQUEST';
const UPDATE_CONNECTION_SUCCESS = 'redis-term/connections/UPDATE_CONNECTION_SUCCESS';
const DELETE_CONNECTION_SUCCESS = 'redis-term/connections/DELETE_CONNECTION_SUCCESS';
const EDIT_CONNECTION = 'redis-term/connections/EDIT_CONNECTION';
const CONNECT_TO_REDIS_REQUEST = 'redis-term/connections/CONNECT_TO_REDIS_REQUEST';
const CONNECT_TO_REDIS_SUCCESS = 'redis-term/connections/CONNECT_TO_REDIS_SUCCESS';

/**
 * @returns {import('../store').Thunk}
 */
const loadConnections = () => async dispatch => { // eslint-disable-line no-unused-vars
  const connections = await api.loadConnections();
  dispatch(loadConnectionsSuccess(connections));
};

/**
 * @returns {import('../store').Thunk}
 */
const addConnection = connection => async (dispatch, getState) => {
  if (getState().connections.isSaving) return;
  dispatch(addConnectionRequest());
  const id = await api.addConnection(connection);
  dispatch(addConnectionSuccess({ ...connection, id }));
};

/**
 * @returns {import('../store').Thunk}
 */
const updateConnection = connection => async (dispatch, getState) => {
  if (getState().connections.isSaving) return;
  dispatch(updateConnectionRequest());
  await api.updateConnection(connection);
  dispatch(updateConnectionSuccess(connection));
};

/**
 * @returns {import('../store').Thunk}
 */
const deleteConnection = connection => async dispatch => {
  await api.deleteConnection(connection);
  dispatch(deleteConnectionSuccess(connection));
};

/**
 * @param {object} connection
 * @returns {import('../store').Thunk}
 */
const connectToRedis = connection => (dispatch, getState, { redis }) => {
  dispatch(connectToRedisRequest());
  return redis.connect(connection)
    .then(() => dispatch(connectToRedisSuccess(connection)));
};

const loadConnectionsSuccess = connections => ({
  type: LOAD_CONNECTIONS_SUCCESS,
  payload: { connections }
});

const addConnectionRequest = () => ({ type: ADD_CONNECTION_REQUEST });

const addConnectionSuccess = connection => ({
  type: ADD_CONNECTION_SUCCESS,
  payload: { connection }
});

const updateConnectionRequest = () => ({ type: UPDATE_CONNECTION_REQUEST });

const updateConnectionSuccess = connection => ({
  type: UPDATE_CONNECTION_SUCCESS,
  payload: { connection }
});

const deleteConnectionSuccess = connection => ({
  type: DELETE_CONNECTION_SUCCESS,
  payload: { connection }
});

const editConnection = connection => ({
  type: EDIT_CONNECTION,
  payload: { connection }
});

const connectToRedisRequest = () => ({ type: CONNECT_TO_REDIS_REQUEST });

const connectToRedisSuccess = connection => ({
  type: CONNECT_TO_REDIS_SUCCESS,
  payload: { connection }
});

export const operations = {
  loadConnections,
  addConnection,
  updateConnection,
  deleteConnection,
  connectToRedis
};

export const actions = {
  loadConnectionsSuccess,
  addConnectionSuccess,
  updateConnectionSuccess,
  deleteConnectionSuccess,
  editConnection
};

/**
 * @typedef {object} ConnectionsState
 * @prop {import('../../connections').Connection[]} list
 * @prop {import('../../connections').Connection} editingConnection
 * @prop {boolean} isSaving
 */
const initialState = {
  list: [],
  isSaving: false,
  editingConnection: null
};

/**
 * @param {ConnectionsState} state 
 * @param {*} action 
 * @returns {ConnectionsState}
 */
export default function reducer(state = initialState, action) {
  switch (action.type) {
  case CONNECT_TO_REDIS_REQUEST:
    return state;
  case CONNECT_TO_REDIS_SUCCESS:
    return state;
  case LOAD_CONNECTIONS_SUCCESS:
    return {
      ...state,
      list: action.payload.connections
    };
  case ADD_CONNECTION_REQUEST:
  case UPDATE_CONNECTION_REQUEST:
    return { ...state, isSaving: true };
  case ADD_CONNECTION_SUCCESS:
    return {
      ...state,
      isSaving: false,
      list: state.list.concat(action.payload.connection)
    };
  case UPDATE_CONNECTION_SUCCESS:
    {
      const connectionIndex = state.list.findIndex(x => x.id === action.payload.connection.id);
      const newList = state.list.map((x, index) => index === connectionIndex ? action.payload.connection : x);
      return {
        ...state,
        isSaving: false,
        editingConnection: null,
        list: newList
      };
    }
  case DELETE_CONNECTION_SUCCESS:
    {
      const connectionIndex = state.list.findIndex(x => x.id === action.payload.connection.id);
      const newList = state.list.filter((x, index) => index !== connectionIndex);
      return {
        ...state,
        list: newList
      };
    }
  case EDIT_CONNECTION:
    return { ...state, editingConnection: action.payload.connection };
  default:
    return state;
  }
}
