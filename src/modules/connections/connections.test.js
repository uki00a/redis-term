import assert from 'assert';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import set from 'lodash/set';
import unset from 'lodash/unset';
import { addConnection, updateConnection, deleteConnection, loadConnections } from './connections';

describe('/modules/connections/connections', () => {
  describe('addConnection(connection, connectionsStore, credentialManager)', () => {
    let connectionId;
    let connectionsStore;
    /** @type {FakeCredentialManager} */
    let credentialManager;

    before(() => {
      connectionId = 1;
      connectionsStore = new FakeConnectionsStore([], connectionId); 
      credentialManager = new FakeCredentialManager();

      const connection = createConnectionWithSecretFields();

      return addConnection(connection, connectionsStore, credentialManager);
    });

    it('should add connection with secret fields masked', async () => {
      const connections = await connectionsStore.getConnections();

      assert.equal(connections.length, 1);
      assert.equal(connections[0].id, 1, 'id should be assigned')
      assert.equal(connections[0].password, 'x', 'password should be masked');
      assert.equal(connections[0].ssh.password, 'x', 'ssh.password should be masked');
      assert.equal(connections[0].ssh.passphrase, 'x', 'ssh.passphrase should be masked');
    });

    it('should save secret fields', async () => {
      assert.equal(await credentialManager.getCredential(connectionId, 'password'), 'hoge', 'password should be saved');
      assert.equal(await credentialManager.getCredential(connectionId, 'ssh.password'), 'fuga', 'ssh.password should be saved');
      assert.equal(await credentialManager.getCredential(connectionId, 'ssh.passphrase'), 'piyo', 'ssh.passphrase should be saved');
    });
  });

  describe('updateConnection(connection, connectionsStore, credentialManager)', () => {
    let connectionId;
    let connectionsStore;
    /** @type {import('./connections').CredentialManager} */
    let credentialManager;

    before(() => {
      connectionId = 1;
      connectionsStore = new FakeConnectionsStore([createConnection({ id: connectionId })]);
      credentialManager = new FakeCredentialManager();

      const connection = createConnectionWithSecretFields({ id: connectionId });

      return updateConnection(connection, connectionsStore, credentialManager);
    });

    it('should update connection with secret fields masked', async () => {
      const connections = await connectionsStore.getConnections();
      assert.equal(connections.length, 1);
      assert.equal(connections[0].id, connectionId, 'id should not be updated');
      assert.equal(connections[0].password, 'x', 'password should be masked');
      assert.equal(connections[0].ssh.password, 'x', 'ssh.password should be masked');
      assert.equal(connections[0].ssh.passphrase, 'x', 'ssh.passphrase should be masked');
    });

    it('should save secret fields', async () => {
      assert.equal(await credentialManager.getCredential(connectionId, 'password'), 'hoge');
      assert.equal(await credentialManager.getCredential(connectionId, 'ssh.password'), 'fuga');
      assert.equal(await credentialManager.getCredential(connectionId, 'ssh.passphrase'), 'piyo');
    });
  });

  describe('deleteConnection(connection, connectionsStore, credentialManager)', () => {
    it('should delete connection and secret fields', async () => {
      const connectionId = 1;
      const connectionToDelete = createConnectionWithSecretFields({ id: connectionId }); 
      const connectionsStore = new FakeConnectionsStore([connectionToDelete]);
      const credentialManager = new FakeCredentialManager();

      await deleteConnection(connectionId, connectionsStore, credentialManager);

      const connections = await connectionsStore.getConnections();
      assert.equal(connections.length, 0);
      assert.ok(!await credentialManager.getCredential(connectionId, 'password'));
      assert.ok(!await credentialManager.getCredential(connectionId, 'ssh.password'));
      assert.ok(!await credentialManager.getCredential(connectionId, 'ssh.passphrase'));
    });
  });

  describe('loadConnections(connectionsStore, credentialManager)', () => {
    it('should resolve secret fields', async () => {
      const connectionId = 1;
      const connection = createConnectionWithSecretFields({ id: connectionId });
      const connectionsStore = new FakeConnectionsStore([connection]);
      const credentialManager = new FakeCredentialManager();

      credentialManager.saveCredential(connectionId, 'password', 'hoge');
      credentialManager.saveCredential(connectionId, 'ssh.password', 'fuga');
      credentialManager.saveCredential(connectionId, 'ssh.passphrase', 'piyo');

      const result = await loadConnections(connectionsStore, credentialManager);

      assert.equal(result.length, 1);
      assert.equal(result[0].id, 1);
      assert.equal(result[0].password, 'hoge', 'password should be resolved');
      assert.equal(result[0].ssh.password, 'fuga', 'ssh.password should be resolved');
      assert.equal(result[0].ssh.passphrase, 'piyo', 'ssh.passphrase should be resolved');
    });
  });

  const createConnection = (override = {}) => Object.freeze({
    name: 'local-redis',
    host: 'localhost',
    port: 6379,
    ...override
  });

  const createConnectionWithSecretFields = (override = {}) => Object.freeze(createConnection({
    password: 'hoge',
    ssh: {
      password: 'fuga',
      passphrase: 'piyo',
      privateKey: '/path/to/secret-key',
      host: '127.0.0.1',
      port: 22
    },
    ...override
  }));

  class FakeConnectionsStore {
    constructor(connections = [], initialId = 1) {
      this.connections = connections;
      this.id = initialId;
    }

    nextIdentifier() {
      return this.id++;
    }

    addConnection(connection) {
      this.connections.push(connection);
    }

    updateConnection(connection) {
      const connectionIndex = this.connections.findIndex(x => x.id === connection.id);
      this.connections[connectionIndex] = connection;
    }

    deleteConnection(connection) {
      const connectionIndex = this.connections.findIndex(x => x.id === connection.id);
      this.connections.splice(connectionIndex, 1);
    }

    getConnections() {
      return Promise.resolve(cloneDeep(this.connections));
    }

    readConnectionById(id) {
      return Promise.resolve(this.connections.find(x => x.id === id));
    }
  }

  class FakeCredentialManager {
    constructor() {
      this.passwords = {};
    }

    saveCredential(connectionId, field, value) {
      set(this.passwords, `${connectionId}.${field}`, value);
      return Promise.resolve();
    }

    getCredential(connectionId, field) {
      return Promise.resolve(get(this.passwords, `${connectionId}.${field}`));
    }

    deleteCredential(connectionId, field) {
      unset(this.passwords, `${connectionId}.${field}`);
      return Promise.resolve();
    }
  }
});