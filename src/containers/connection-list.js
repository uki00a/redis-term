import * as fs from 'fs';
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';
import ConnectionList from '../components/connection-list';
import Loader from '../components/loader';
import KeyboardBindings from './keyboard-bindings';
import { noop } from '../modules/utils';

import { useContainer, ConnectionsContainer } from '../hooks/container';

/**
 * @this {never}
 */
function ConnectionListContainer({
  history,
  editConnection,
  connectToRedis
}) {
  const {
    connections,
    isLoading,
    loadConnectionsIfNotLoaded,
    deleteConnection
  } = useContainer(ConnectionsContainer); 
  const list = useRef(null);

  useEffect(() => {
    loadConnectionsIfNotLoaded().then(() => {
      if (list.current) {
        list.current.focus();
      }
    });
  }, []); // eslint-disable-line

  const addConnection = () => {
    history.push('/connections/new');
  };

  const getSelectedConnection = () => {
    const connectionIndex = list.current.selected();
    const connection = connections[connectionIndex];
    return connection;
  };

  const deleteSelectedConnection = () => {
    const connection = getSelectedConnection();
    if (connection) {
      deleteConnection(connection);
    }
  };

  const editSelectedConnection = () => {
    const connection = getSelectedConnection();
    editConnection(connection);
  };


  const handleConnectionSelect = (item, connectionIndex) => {
    const connection = cloneDeep(connections[connectionIndex]);
    resolvePaths(connection);
    connectToRedis(connection)
      .then(() => history.push('/database'));
  };

  const keyboardBindings = [
    { key: 'a', description: 'Add', handler: addConnection },
    { key: 'e', description: 'Edit', handler: editSelectedConnection },
    { key: 'd', description: 'Delete', handler: deleteSelectedConnection }
  ];

  return (
    <>
      <KeyboardBindings bindings={keyboardBindings}>
        <ConnectionList
          hidden={isLoading}
          onSelect={handleConnectionSelect}
          ref={list}
          connections={connections}
        />
      </KeyboardBindings>
      <Loader text='loading...' hidden={!isLoading} />
    </>
  );
}

function resolvePaths(connection) {
  resolveTLSPaths(connection);
  resolveSSHPaths(connection);
}

function resolveTLSPaths(connection) {
  if (connection.tls) {
    connection.tls.key = readIfExists(connection.tls.key);
    connection.tls.cert = readIfExists(connection.tls.cert);
    connection.tls.ca = readIfExists(connection.tls.ca);
  }
}

function resolveSSHPaths(connection) {
  if (connection.ssh) {
    connection.ssh.privateKey = readIfExists(connection.ssh.privateKey);
  }
}

function readIfExists(path) {
  if (path && fs.existsSync(path)) {
    return fs.readFileSync(path, { encoding: 'utf-8' });
  }
}

export default ConnectionListContainer;