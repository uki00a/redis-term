// @ts-check
import keytar from 'keytar';

export default class CredentialManager {
  constructor() {
    this.serviceName = 'redis-term';
  }

  getCredential(connectionId, field) {
    return keytar.getPassword(this.serviceName, accountFor(connectionId, field));
  }

  saveCredential(connectionId, field, password) {
    return keytar.setPassword(this.serviceName, accountFor(connectionId, field), password);
  }

  deleteCredential(connectionId, field) {
    return keytar.deletePassword(this.serviceName, accountFor(connectionId, field));
  }
}

function accountFor(connectionId, field) {
  return `${connectionId}:${field}`;
}