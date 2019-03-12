import * as fs from 'fs';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ConnectionForm from '../components/connection-form';
import { operations } from '../modules/redux/database';

class ConnectionFormContainer extends Component {
  static propTypes = {
    connectToRedis: PropTypes.func.isRequired,
    database: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  _handleSubmit = options => {
    const normalizedOptions = this._normalizeOptions(options);
    this.props.connectToRedis(normalizedOptions);
  };

  _normalizeOptions(options) {
    return this._normalizeSSHOptions(this._normalizeTLSOptions(options));
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
    const tlsOptions = ['tlskey', 'tlscert', 'tlsca'];
    return tlsOptions.some(option => options[option]);
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
    const sshOptions = ['sshhost', 'sshport', 'sshuser', 'sshprivateKeyPath', 'sshpassword'];
    return sshOptions.some(option => options[option]);
  }

  _readIfExists(path) {
    if (fs.existsSync(path)) {
      return fs.readFileSync(path);
    }
  }

  componentDidUpdate() {
    if (this.props.database.succeeded) {
      this.props.history.push('/database');
    }
  }

  render() {
    return <ConnectionForm onSubmit={this._handleSubmit}></ConnectionForm>;
  }
}

const mapStateToProps = ({ database }) => ({ database });
const mapDispatchToProps = { connectToRedis: operations.connectToRedis };

export default connect(
  mapStateToProps,  
  mapDispatchToProps
)(ConnectionFormContainer);
