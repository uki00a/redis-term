import * as fs from 'fs';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ConnectionForm from '../components/connection-form';
import { operations } from '../modules/redux/connections';

const TLS_OPTIONS = ['tlskey', 'tlscert', 'tlsca'];
const SSH_OPTIONS = ['sshhost', 'sshport', 'sshuser', 'sshprivateKeyPath', 'sshpassword'];

class ConnectionFormContainer extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    isNew: PropTypes.bool.isRequired,
    addConnection: PropTypes.func.isRequired,
    updateConnection: PropTypes.func.isRequired,
    connection: PropTypes.object,
  };

  _handleSubmit = options => {
    const normalizedOptions = this._normalizeOptions(options);
    this._addOrUpdateConnection(normalizedOptions)
      .then(() => this.props.history.push('/connections'));
  };

  _addOrUpdateConnection = options => {
    if (this.props.isNew) {
      return this.props.addConnection(options);
    } else {
      return this.props.updateConnection(options);
    }
  };

  _normalizeOptions(options) {
    const normalizedOptions = this._normalizeSSHOptions(this._normalizeTLSOptions(options));
    this._removeUnnecessaryOptions(normalizedOptions);
    normalizedOptions.id = this.props.connection && this.props.connection.id;
    normalizedOptions.name = normalizedOptions.name || `${normalizedOptions.host}:${normalizedOptions.port}`;
    
    return normalizedOptions;
  }

  _removeUnnecessaryOptions(options) {
    TLS_OPTIONS.forEach(key => delete options[key]);
    SSH_OPTIONS.forEach(key => delete options[key]);
  }

  _normalizeTLSOptions(options) {
    if (this._containsTLSOptions(options)) {
      // TODO cleanup
      const { tlskey, tlscert, tlsca, ...restOptions } = options;
      restOptions.tls = {};
      restOptions.tls.key = this._readIfExists(tlskey);
      restOptions.tls.cert = this._readIfExists(tlscert);
      restOptions.tls.ca = this._readIfExists(tlsca);
      return restOptions;
    } else {
      return options;
    }
  }

  _containsTLSOptions(options) {
    return TLS_OPTIONS.some(option => options[option]);
  }

  _normalizeSSHOptions(options) {
    if (this._containsSSHOptions(options)) {
      // TODO cleanup
      const {
        sshhost,
        sshport,
        sshuser,
        sshprivateKeyPath,
        sshpassword,
        ...restOptions
      } = options;
      restOptions.ssh = {
        host: sshhost,
        port: sshport,
        username: sshuser,
        privateKey: this._readIfExists(sshprivateKeyPath),
        password: sshpassword
      };
      return restOptions;
    } else  {
      return options;
    }
  }

  _containsSSHOptions(options) {
    return SSH_OPTIONS.some(option => options[option]);
  }

  _readIfExists(path) {
    if (fs.existsSync(path)) {
      return fs.readFileSync(path);
    }
  }

  render() {
    return (
      <ConnectionForm
        connection={this.props.isNew ? {} : this.props.connection}
        onSubmit={this._handleSubmit}>
      </ConnectionForm>
    );
  }
}

const mapStateToProps = ({ connections }) => ({
  connection: connections.editingConnection
});
const mapDispatchToProps = {
  addConnection: operations.addConnection,
  updateConnection: operations.updateConnection
};

export default connect(
  mapStateToProps,  
  mapDispatchToProps
)(ConnectionFormContainer);
