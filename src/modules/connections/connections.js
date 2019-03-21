// @ts-check
import assert from 'assert';
import get from 'lodash/get';
import set from 'lodash/set';
import cloneDeep from 'lodash/cloneDeep';
import { isBlank } from '../utils';

const SECRET_FIELDS = ['password', 'ssh.password', 'ssh.passphrase'];
const MASK = 'x';

/**
 * @typedef {object} Connection
 * @prop {ConnectionId} [id]
 * @prop {string} name
 * @prop {string} host
 * @prop {string} port
 * 
 * @typedef {object} ConnectionsStore
 * @prop {(connection: Connection) => Promise} addConnection
 * @prop {(connection: Connection) => Promise} updateConnection
 * @prop {() => Promise<Connection[]>} getConnections
 * @prop {(id: ConnectionId) => Promise<Connection>} getConnectionById
 * @prop {(connection: Connection) => Promise} deleteConnection
 * @prop {() => string} nextIdentifier
 * 
 * @typedef {object} CredentialManager
 * @prop {(connectionId: ConnectionId, field: string) => Promise<string>} getCredential
 * @prop {(connectionId: ConnectionId, field: string, password: string) => Promise} saveCredential
 * @prop {(connectionId: ConnectionId, field: string) => Promise} deleteCredential
 * 
 * @typedef {string|number} ConnectionId
 */

 /**
  * @param {Connection} connection
  * @param {ConnectionsStore} connectionsStore
  * @param {CredentialManager} credentialManager
  * @returns {Promise<ConnectionId>}
  * 
  */
export async function addConnection(connection, connectionsStore, credentialManager) {
  assert.ok(!connection.id);
  const connectionId = connectionsStore.nextIdentifier();
  await saveSecretFields(credentialManager, connection, connectionId);
  const maskedConnection = maskConnection(connection);
  maskedConnection.id = connectionId;
  await connectionsStore.addConnection(maskedConnection);
  return connectionId;
}

/**
 * @param {Connection} connection 
 * @param {ConnectionsStore} connectionsStore 
 * @param {CredentialManager} credentialManager 
 */
export async function updateConnection(connection, connectionsStore, credentialManager) {
  assert.ok(connection.id);
  await saveSecretFields(credentialManager, connection, connection.id);
  const maskedConnection = maskConnection(connection);
  await connectionsStore.updateConnection(maskedConnection);
}

/**
 * @param {ConnectionId} connectionId 
 * @param {ConnectionsStore} connectionsStore 
 * @param {CredentialManager} credentialManager 
 */
export async function deleteConnection(connectionId, connectionsStore, credentialManager) {
  assert.ok(connectionId != null);
  const connectionToDelete = await connectionsStore.getConnectionById(connectionId);
  await deleteSecretFields(credentialManager, connectionToDelete, connectionId);
  await connectionsStore.deleteConnection(connectionToDelete);
}

/**
 * @param {ConnectionsStore} connectionsStore 
 * @param {CredentialManager} credentialManager 
 * @returns {Promise<Connection[]>}
 */
export async function loadConnections(connectionsStore, credentialManager) {
  const connections = await connectionsStore.getConnections();
  await resolveConnections(credentialManager, connections);
  return connections;
}

/**
 * @param {CredentialManager} credentialManager 
 * @param {Connection} connection 
 * @param {ConnectionId} connectionId 
 * @returns {Promise}
 */
function saveSecretFields(credentialManager, connection, connectionId = connection.id) {
  assert.ok(connectionId);
  const secretFields = extractSecretFields(connection);
  const promises = secretFields.map(field => credentialManager.saveCredential(connectionId, field, get(connection, field)));
  return Promise.all(promises);
}

/**
 * @param {CredentialManager} credentialManager 
 * @param {Connection} connection
 * @param {ConnectionId} connectionId
 * @returns {Promise}
 */
function deleteSecretFields(credentialManager, connection, connectionId = connection.id) {
  assert.ok(connectionId);
  const secretFields = extractSecretFields(connection);
  const promises = secretFields.map(field => credentialManager.deleteCredential(connectionId, field));
  return Promise.all(promises);
}

/**
 * @param {Connection} connection
 * @returns {string[]}
 */
function extractSecretFields(connection) {
  return SECRET_FIELDS.filter(x => has(connection, x));
}

/**
 * @param {CredentialManager} passwordSaver 
 * @param {Connection[]} connections 
 * @returns {Promise}
 */
async function resolveConnections(passwordSaver, connections) {
  const promises = connections.map(x => resolveSecretFields(x, passwordSaver));
  await Promise.all(promises);
}

/**
 * @param {Connection} connection 
 * @param {CredentialManager} passwordSaver 
 * @returns {Promise}
 */
function resolveSecretFields(connection, passwordSaver) {
  const secretFields = extractSecretFields(connection);
  const promises = secretFields.map(async field => {
    connection[field] = await passwordSaver.getCredential(connection.id, field); 
  });
  return Promise.all(promises);
}

/**
 * @param {Connection} connection 
 * @returns {Connection}
 */
function maskConnection(connection) {
  return SECRET_FIELDS.reduce((connection, item) => {
    if (has(connection, item)) {
      set(connection, item, MASK);
    }
    return connection;
  }, cloneDeep(connection));
}

function has(object, key) {
  return !isBlank(get(object, key));
}
