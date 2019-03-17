// @ts-check
import * as connections from './connections';
import { createCredentialManager } from './credential-manager';
import { createConnectionsStore } from './connections-store';

/**
 * @typedef {import('./connections').Connection} Connection
 */

/**
 * @param {Connection} connection 
 */
export function addConnection(connection) {
  return connections.addConnection(connection, createConnectionsStore(), createCredentialManager());
}

/**
 * @param {Connection} connection 
 */
export function updateConnection(connection) {
  return connections.updateConnection(connection, createConnectionsStore(), createCredentialManager());
}

/**
 * @returns {Promise<Connection[]>} 
 */
export function loadConnections() {
  return connections.loadConnections(createConnectionsStore(), createCredentialManager());
}

/**
 * @param {Connection} connection 
 */
export function deleteConnection(connection) {
  return connections.deleteConnection(connection.id, createConnectionsStore(), createCredentialManager());
}
