// @ts-check
import * as api from '../../connections';

const LOAD_CONNECTIONS_REQUEST = 'redis-term/connections/LOAD_CONNECTIONS_REQUEST';
const LOAD_CONNECTIONS_SUCCESS = 'redis-term/connections/LOAD_CONNECTIONS_SUCCESS';
const LOAD_CONNECTIONS_FAILURE = 'redis-term/connections/LOAD_CONNECTIONS_FAILURE';
const ADD_CONNECTION_REQUEST = 'redis-term/connections/ADD_CONNECTION_REQUEST';
const ADD_CONNECTION_SUCCESS = 'redis-term/connections/ADD_CONNECTION_SUCCESS';
const ADD_CONNECTION_FAILURE = 'redis-term/connections/ADD_CONNECTION_FAILURE';
const UPDATE_CONNECTION_REQUEST = 'redis-term/connections/UPDATE_CONNECTION_REQUEST';
const UPDATE_CONNECTION_SUCCESS = 'redis-term/connections/UPDATE_CONNECTION_SUCCESS';
const UPDATE_CONNECTION_FAILURE = 'redis-term/connections/UPDATE_CONNECTION_FAILURE';
const DELETE_CONNECTION_REQUEST = 'redis-term/connections/DELETE_CONNECTION_REQUEST';
const DELETE_CONNECTION_SUCCESS = 'redis-term/connections/DELETE_CONNECTION_SUCCESS';
const DELETE_CONNECTION_FAILURE = 'redis-term/connections/DELETE_CONNECTION_FAILURE';
const EDIT_CONNECTION = 'redis-term/connections/EDIT_CONNECTION';
const CONNECT_TO_REDIS_REQUEST = 'redis-term/connections/CONNECT_TO_REDIS_REQUEST';
const CONNECT_TO_REDIS_SUCCESS = 'redis-term/connections/CONNECT_TO_REDIS_SUCCESS';
const CONNECT_TO_REDIS_FAILURE = 'redis-term/connections/CONNECT_TO_REDIS_FAILURE';

/**
 * @returns {import('../store').Thunk}
 */
const loadConnections = () => async (dispatch, getState) => {
  if (isLoading(getState())) return;
  dispatch(loadConnectionsRequest());
  try {
    const connections = await api.loadConnections();
    dispatch(loadConnectionsSuccess(connections));
  } catch (error) {
    dispatch(loadConnectionsFailure(error));
  }
};

/**
 * @returns {import('../store').Thunk}
 */
const addConnection = connection => async (dispatch, getState) => {
  if (isSaving(getState())) return;
  dispatch(addConnectionRequest());
  try {
    const id = await api.addConnection(connection);
    dispatch(addConnectionSuccess({ ...connection, id }));
  } catch (error) {
    dispatch(addConnectionFailure(error));
  }
};

/**
 * @returns {import('../store').Thunk}
 */
const updateConnection = connection => async (dispatch, getState) => {
  if (isSaving(getState())) return;
  dispatch(updateConnectionRequest());
  try {
    await api.updateConnection(connection);
    dispatch(updateConnectionSuccess(connection));
  } catch (error) {
    dispatch(updateConnectionFailure(error));
  }
};

/**
 * @returns {import('../store').Thunk}
 */
const deleteConnection = connection => async (dispatch, getState) => {
  if (isSaving(getState())) return;
  dispatch(deleteConnectionRequest());
  try {
    await api.deleteConnection(connection);
    dispatch(deleteConnectionSuccess(connection));
  } catch (error) {
    dispatch(deleteConnectionFailure(error));
  }
};

/**
 * @param {object} connection
 * @returns {import('../store').Thunk}
 */
const connectToRedis = connection => async (dispatch, getState, { redis }) => {
  if (isConnecting(getState())) return;
  dispatch(connectToRedisRequest());
  try {
    await redis.connect(connection);
    dispatch(connectToRedisSuccess(connection));
  } catch (error) {
    dispatch(connectToRedisFailure(error));
  }
};

const loadConnectionsRequest = () => ({ type: LOAD_CONNECTIONS_REQUEST });

const loadConnectionsSuccess = connections => ({
  type: LOAD_CONNECTIONS_SUCCESS,
  payload: { connections }
});

const loadConnectionsFailure = error => ({ type: LOAD_CONNECTIONS_FAILURE, error });

const addConnectionRequest = () => ({ type: ADD_CONNECTION_REQUEST });

const addConnectionSuccess = connection => ({
  type: ADD_CONNECTION_SUCCESS,
  payload: { connection }
});

const addConnectionFailure = error => ({ type: ADD_CONNECTION_FAILURE, error });

const updateConnectionRequest = () => ({ type: UPDATE_CONNECTION_REQUEST });

const updateConnectionSuccess = connection => ({
  type: UPDATE_CONNECTION_SUCCESS,
  payload: { connection }
});

const updateConnectionFailure = error => ({ type: UPDATE_CONNECTION_FAILURE, error });

const deleteConnectionRequest = () => ({ type: DELETE_CONNECTION_REQUEST });

const deleteConnectionSuccess = connection => ({
  type: DELETE_CONNECTION_SUCCESS,
  payload: { connection }
});

const deleteConnectionFailure = error => ({ type: DELETE_CONNECTION_FAILURE, error });

const editConnection = connection => ({
  type: EDIT_CONNECTION,
  payload: { connection }
});

const connectToRedisRequest = () => ({ type: CONNECT_TO_REDIS_REQUEST });

const connectToRedisSuccess = connection => ({
  type: CONNECT_TO_REDIS_SUCCESS,
  payload: { connection }
});

const connectToRedisFailure = error => ({ type: CONNECT_TO_REDIS_FAILURE, error });

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
 * @prop {boolean} isLoading
 * @prop {boolean} isConnecting
 */
const initialState = {
  list: [],
  isSaving: false,
  isLoading: false,
  isConnecting: false,
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
    return { ...state, isConnecting: true };
  case CONNECT_TO_REDIS_SUCCESS:
    return { ...state, isConnecting: false };
  case CONNECT_TO_REDIS_FAILURE:
    return { ...state, isConnecting: false };
  case LOAD_CONNECTIONS_REQUEST:
    return { ...state, isLoading: true };
  case LOAD_CONNECTIONS_SUCCESS:
    return {
      ...state,
      isLoading: false,
      list: action.payload.connections
    };
  case LOAD_CONNECTIONS_FAILURE:
    return { ...state, isLoading: false };
  case ADD_CONNECTION_REQUEST:
    return { ...state, isSaving: true };
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
  case ADD_CONNECTION_FAILURE:
    return { ...state, isSaving: false };
  case UPDATE_CONNECTION_FAILURE:
    return { ...state, isSaving: false };
  case DELETE_CONNECTION_REQUEST:
    return { ...state, isSaving: true };
  case DELETE_CONNECTION_SUCCESS:
    {
      const connectionIndex = state.list.findIndex(x => x.id === action.payload.connection.id);
      const newList = state.list.filter((x, index) => index !== connectionIndex);
      return {
        ...state,
        isSaving: false,
        list: newList
      };
    }
  case DELETE_CONNECTION_FAILURE:
    return { ...state, isSaving: false };
  case EDIT_CONNECTION:
    return { ...state, editingConnection: action.payload.connection };
  default:
    return state;
  }
}

/**
 * @typedef {import('../store').State} State
 * @param {State} state 
 */
const isSaving = state => state.connections.isSaving;

/** @param {State} state */
const isLoading = state => state.connections.isLoading;

/** @param {State} state */
const isConnecting = state => state.connections.isConnecting;