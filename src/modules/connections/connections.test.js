import assert from 'assert';
import td from 'testdouble';
import { addConnection, updateConnection, deleteConnection, loadConnections } from './connections';

describe('/modules/connections/connections', () => {
  describe('addConnection(connection, connectionsStore, credentialManager)', () => {
    let connectionId;
    let connectionsStore;
    /** @type {FakeCredentialManager} */
    let credentialManager;

    before(() => {
      connectionId = 1;
      connectionsStore = td.object(['nextIdentifier', 'addConnection']),
      credentialManager = td.object(['saveCredential']);

      const connection = createConnectionWithSecretFields();

      td.when(connectionsStore.nextIdentifier()).thenReturn(connectionId);

      return addConnection(connection, connectionsStore, credentialManager);
    });

    it('should add connection with secret fields masked', async () => {
      td.verify(connectionsStore.addConnection(td.matchers.contains({
        id: connectionId,
        name: 'local-redis',
        password: 'x',
        ssh: {
          password: 'x',
          passphrase: 'x'
        }
      })));
    });

    it('should save secret fields', async () => {
      td.verify(credentialManager.saveCredential(connectionId, 'password', 'hoge'), {times: 1});
      td.verify(credentialManager.saveCredential(connectionId, 'ssh.password', 'fuga'), {times: 1});
      td.verify(credentialManager.saveCredential(connectionId, 'ssh.passphrase', 'piyo'), {times: 1});
    });
  });

  describe('updateConnection(connection, connectionsStore, credentialManager)', () => {
    let connectionId;
    let connectionsStore;
    /** @type {import('./connections').CredentialManager} */
    let credentialManager;

    before(() => {
      connectionId = 1;
      connectionsStore = td.object(['updateConnection']);
      credentialManager = td.object(['saveCredential']);

      const connection = createConnectionWithSecretFields({ id: connectionId });

      return updateConnection(connection, connectionsStore, credentialManager);
    });

    it('should update connection with secret fields masked', async () => {
      td.verify(connectionsStore.updateConnection(td.matchers.contains({
        id: connectionId,
        name: 'local-redis',
        password: 'x',
        ssh: {
          password: 'x',
          passphrase: 'x'
        }
      })));
    });

    it('should save secret fields', async () => {
      td.verify(credentialManager.saveCredential(connectionId, 'password', 'hoge'), {times: 1});
      td.verify(credentialManager.saveCredential(connectionId, 'ssh.password', 'fuga'), {times: 1});
      td.verify(credentialManager.saveCredential(connectionId, 'ssh.passphrase', 'piyo'), {times: 1});
    });
  });

  describe('deleteConnection(connection, connectionsStore, credentialManager)', () => {
    it('should delete connection and secret fields', async () => {
      const connectionId = 1;
      const connectionToDelete = createConnectionWithSecretFields({ id: connectionId }); 
      const connectionsStore = td.object(['deleteConnection', 'getConnectionById']);
      const credentialManager = td.object(['deleteCredential']);

      td.when(connectionsStore.getConnectionById(connectionId)).thenReturn(connectionToDelete);

      await deleteConnection(connectionId, connectionsStore, credentialManager);

      td.verify(connectionsStore.deleteConnection(connectionToDelete), {times: 1});
      td.verify(credentialManager.deleteCredential(connectionId, 'password'), {times: 1});
      td.verify(credentialManager.deleteCredential(connectionId, 'ssh.password'), {times: 1});
      td.verify(credentialManager.deleteCredential(connectionId, 'ssh.passphrase'), {times: 1});
    });
  });

  describe('loadConnections(connectionsStore, credentialManager)', () => {
    it('should resolve secret fields', async () => {
      const connectionId = 1;
      const connection = createConnectionWithSecretFields({ id: connectionId });
      const connectionsStore = td.object(['getConnections']);
      const credentialManager = td.object(['getCredential']);

      td.when(connectionsStore.getConnections()).thenResolve([connection]);
      td.when(credentialManager.getCredential(connectionId, 'password')).thenResolve('hoge');
      td.when(credentialManager.getCredential(connectionId, 'ssh.password')).thenResolve('fuga');
      td.when(credentialManager.getCredential(connectionId, 'ssh.passphrase')).thenResolve('piyo');

      const result = await loadConnections(connectionsStore, credentialManager);

      assert.equal(result.length, 1);
      assert.equal(result[0].id, 1);
      assert.equal(result[0].password, 'hoge', 'password should be resolved');
      assert.equal(result[0].ssh.password, 'fuga', 'ssh.password should be resolved');
      assert.equal(result[0].ssh.passphrase, 'piyo', 'ssh.passphrase should be resolved');
    });
  });

  const createConnection = (override = {}) => ({
    name: 'local-redis',
    host: 'localhost',
    port: 6379,
    ...override
  });

  const createConnectionWithSecretFields = (override = {}) => createConnection({
    password: 'hoge',
    ssh: {
      password: 'fuga',
      passphrase: 'piyo',
      privateKey: '/path/to/secret-key',
      host: '127.0.0.1',
      port: 22
    },
    ...override
  });
});