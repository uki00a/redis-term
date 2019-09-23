import React from 'react';
import ConnectionForm from '../../src/containers/connection-form';
import { ConnectionsContainer } from '../../src/hooks/container';
import {
  createStore,
  render,
  fireEvent,
  waitForElementToBeHidden,
  createScreen,
} from '../helpers';
import assert from 'assert';
import path from 'path';
import fs from 'fs';
import xdgBaseDir from 'xdg-basedir';
import td from 'testdouble';
import keytar from 'keytar';

describe('<ConnectionForm>', () => {
  let screen;

  const pathToCacheDirectory = path.join(__dirname, '..', 'tmp', '.cache');
  const pathToConnectionsFile = path.join(pathToCacheDirectory, 'redis-term', 'connections.json');

  beforeEach(() => removeFile(pathToConnectionsFile));
  afterEach(cleanup);

  it('can create a new connection', async () => {
    screen = createScreen();
    td.replace(xdgBaseDir, 'cache', pathToCacheDirectory);

    const history = { push: td.func(['history.push']) };
    const { getByContent, getBy } = await renderSubject({
      screen,
      history,
      connection: {}
    });
    const set = (name, value) => getBy(x => x.name === name).setValue(value);

    set('name', 'test-server');
    set('host', '127.0.0.1');
    set('port', '6379');
    set('password', '1234');
    set('tlskey', '/path/to/key.pem');
    set('tlscert', '/path/to/cert.pem');
    set('tlsca', '/path/to/ca.pem');
    set('sshhost', '127.0.0.1');
    set('sshport', '22');
    set('sshusername', 'hoge');
    set('sshprivateKey', '/path/to/id_rsa');
    set('sshpassphrase', 'hello');

    const saveButton = getByContent(/Save/i);
    fireEvent.click(saveButton);
    await waitForElementToBeHidden(() => getBy(x => x.name === 'loader'));

    const connections = await readJSONFile(pathToConnectionsFile);
    assert(Array.isArray(connections));
    assert.strictEqual(1, connections.length);
    assert('string', typeof connections[0].id, 'id should be saved');
    assert('test-server', connections[0].name, 'name should be saved');
    assert.strictEqual('127.0.0.1', connections[0].host, 'host should be saved');
    assert.strictEqual('6379', connections[0].port, 'port should be saved');
    assert.strictEqual('x', connections[0].password, 'password should be saved');
    assert.deepEqual({
      key: '/path/to/key.pem',
      cert: '/path/to/cert.pem',
      ca: '/path/to/ca.pem'
    }, connections[0].tls, '.tls should be saved');
    assert.deepEqual({
      host: '127.0.0.1',
      port: '22',
      password: '',
      privateKey: '/path/to/id_rsa',
      passphrase: 'x',
      username: 'hoge'
    }, connections[0].ssh, '.ssh should be saved');

    const savedPassword = await keytar.getPassword('redis-term', `${connections[0].id}:password`);
    const savedPassphrase = await keytar.getPassword('redis-term', `${connections[0].id}:ssh.passphrase`);
    assert.strictEqual('1234', savedPassword, 'password should be saved with keytar');
    assert.strictEqual('hello', savedPassphrase, 'ssh.passphrase should be saved with keytar');

    td.verify(history.push('/connections'), {times: 1});
  });

  async function cleanup() {
    td.reset();
    screen.destroy();

    const connections = await readJSONFile(pathToConnectionsFile);
    for (const connection of connections) {
      await keytar.deletePassword('redis-term', `${connection.id}:password`);
      await keytar.deletePassword('redis-term', `${connection.id}:ssh.passphrase`);
    }

    return removeFile(pathToConnectionsFile);
  }

  async function renderSubject({ screen, history, connection }) {
    // TODO remove this
    const store = createStore({
      state: {
        connections: { editingConnection: connection, isSaving: false }
      }
    });
    const subject = render(
      <ConnectionsContainer.Provider>
        <ConnectionForm history={history} isNew={true} />
      </ConnectionsContainer.Provider>,
      screen,
      { store }
    );
    return subject;
  }

  function waitForFileToBeCreated(path) {
    return new Promise(resolve => {
      let timer = setInterval(() => {
        fs.access(path, error => {
          if (error == null) {
            clearTimeout(timer);
            resolve();
          }
        });
      }, 50);
    })
  }

  function readJSONFile(path) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, {encoding: 'utf8'}, (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(JSON.parse(data));
        }
      });
    });
  }

  function removeFile(path) {
    return new Promise((resolve, reject) => {
      fs.unlink(path, error => {
        if (error && error.code !== 'ENOENT') {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
});