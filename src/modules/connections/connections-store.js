// @ts-check
import uuidv1 from 'uuid/v1';
import { fileExists, makeParentDirectory, readJSONFile, writeJSONFile, getPathToConnectionsJSON } from '../utils/file';

class ConnectionsStore {
  constructor() {
    this.path = getPathToConnectionsJSON();
  }

  nextIdentifier() {
    return uuidv1();
  }

  async getConnectionById(id) {
    const connections = await this.getConnections();
    return connections.find(x => x.id === id);
  }

  async getConnections() {
    await this.ensureConnectionsFile();
    return await readJSONFile(this.path);
  }

  async deleteConnection(connection) {
    const connections = await this.getConnections();
    const connectionIndex = connections.findIndex(x => x.id === connection.id);
    connections.splice(connectionIndex, 1);
    await this.writeConnections(connections);
  }

  async addConnection(connection) {
    const connections = await this.getConnections();
    connections.push(connection);
    await this.writeConnections(connections);
  }

  async updateConnection(connection) {
    const connections = await this.getConnections();
    const connectionIndex = connections.findIndex(x => x.id === connection.id);
    connections[connectionIndex] = connection;
    await this.writeConnections(connections);
  }

  /**
   * @param {object[]} connections 
   */
  async writeConnections(connections) {
    return await writeJSONFile(this.path, connections);
  }

  async ensureConnectionsFile() {
    if (!(await fileExists(this.path))) {
      await makeParentDirectory(this.path);
      await writeJSONFile(this.path, []);
    } 
  }
}

export const createConnectionsStore = () => new ConnectionsStore();