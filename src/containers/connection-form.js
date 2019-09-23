import React from 'react';
import ConnectionForm from '../components/connection-form';
import { ConnectionsContainer, useContainer } from '../hooks/container';

const TLS_OPTIONS = ['tlskey', 'tlscert', 'tlsca'];
const SSH_OPTIONS = ['sshhost', 'sshport', 'sshuser', 'sshprivateKeyPath', 'sshpassword'];

function _ConnectionFormContainer({
  history,
  isNew,
  connection
}) {
  const {
    addConnection, 
    updateConnection,
    isSaving
  } = useContainer(ConnectionsContainer);

  const handleSubmit = options => {
    const normalizedOptions = normalizeOptions(options);
    addOrUpdateConnection(normalizedOptions)
      .then(() => history.push('/connections'));
  };

  const addOrUpdateConnection = options => {
    if (isNew) {
      return addConnection(options);
    } else {
      return updateConnection(options);
    }
  };

  const normalizeOptions = options => {
    const normalizedOptions = normalizeSSHOptions(normalizeTLSOptions(options));
    removeUnnecessaryOptions(normalizedOptions);
    normalizedOptions.id = connection && connection.id;
    normalizedOptions.name = normalizedOptions.name || `${normalizedOptions.host}:${normalizedOptions.port}`;    
    return normalizedOptions;
  };

  return (
    <ConnectionForm
      connection={isNew ? {} : connection}
      isSaving={isSaving}
      onSubmit={handleSubmit}>
    </ConnectionForm>
  );
}

function normalizeTLSOptions(options) {
  if (containsTLSOptions(options)) {
    // TODO cleanup
    const { tlskey, tlscert, tlsca, ...restOptions } = options;
    restOptions.tls = {};
    restOptions.tls.key = tlskey;
    restOptions.tls.cert = tlscert;
    restOptions.tls.ca = tlsca;
    return restOptions;
  } else {
    return options;
  }
}

function normalizeSSHOptions(options) {
  if (containsSSHOptions(options)) {
    // TODO cleanup
    const {
      sshhost,
      sshport,
      sshusername,
      sshprivateKey,
      sshpassword,
      sshpassphrase,
      ...restOptions
    } = options;
    restOptions.ssh = {
      host: sshhost,
      port: sshport,
      username: sshusername,
      privateKey: sshprivateKey,
      passphrase: sshpassphrase,
      password: sshpassword
    };
    return restOptions;
  } else  {
    return options;
  }
}

function containsTLSOptions(options) {
  return TLS_OPTIONS.some(option => options[option]);
}

function containsSSHOptions(options) {
  return SSH_OPTIONS.some(option => options[option]);
}

function removeUnnecessaryOptions(options) {
  TLS_OPTIONS.forEach(key => delete options[key]);
  SSH_OPTIONS.forEach(key => delete options[key]);
}

export default _ConnectionFormContainer;