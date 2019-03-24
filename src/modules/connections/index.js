// @ts-check
import * as connections from './connections';
import CredentialManager from './credential-manager';
import ConnectionsStore from './connections-store';

/**
 * @typedef {import('./connections').Connection} Connection
 */

/**
 * @param {Connection} connection 
 */
export function addConnection(connection) {
  return connections.addConnection(connection, new ConnectionsStore(), new CredentialManager());
}

/**
 * @param {Connection} connection 
 */
export function updateConnection(connection) {
  return connections.updateConnection(connection, new ConnectionsStore(), new CredentialManager());
}

/**
 * @returns {Promise<Connection[]>} 
 */
export function loadConnections() {
  return connections.loadConnections(new ConnectionsStore(), new CredentialManager());
}

/**
 * @param {Connection} connection 
 */
export function deleteConnection(connection) {
  return connections.deleteConnection(connection.id, new ConnectionsStore(), new CredentialManager());
}
