import * as fs from 'fs';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';
import ConnectionList from '../components/connection-list';
import Loader from '../components/loader';
import KeyboardBindings from './keyboard-bindings';
import { operations, actions } from '../modules/redux/connections';
import { noop } from '../modules/utils';

class ConnectionListContainer extends Component {
  static propTypes = {
    connections: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
    loadConnections: PropTypes.func.isRequired,
    editConnection: PropTypes.func.isRequired,
    deleteConnection: PropTypes.func.isRequired,
    connectToRedis: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
  };

  async componentDidMount() {
    try {
      await this._loadConnectionsIfNotLoaded();
    } finally {
      this.refs.list.focus();
    }
  }

  componentDidUpdate() {
    this.refs.list.focus();
  }

  _loadConnectionsIfNotLoaded() {
    if (this.props.connections.length === 0) {
      return this.props.loadConnections();
    }
  }

  _addConnection = () => {
    this.props.history.push('/connections/new');
  };

  _editSelectedConnection = () => {
    const connection = this._getSelectedConnection();
    this.props.editConnection(connection);
    this.props.history.push(`/connections/${connection.id}/edit`);
  };

  _deleteSelectedConnection = () => {
    const connection = this._getSelectedConnection();
    if (connection) {
      this.props.deleteConnection(connection);
    }
  };

  _getSelectedConnection() {
    const connectionIndex = this.refs.list.selected();
    const connection = this.props.connections[connectionIndex];
    return connection;
  }

  _handleConnectionSelect = (item, connectionIndex) => {
    const connection = cloneDeep(this.props.connections[connectionIndex]);
    this._resolvePaths(connection);
    this.props.connectToRedis(connection)
      .then(() => this.props.history.push('/database'))
      .catch(noop);
  };

  // TODO refactor
  _resolvePaths(connection) {
    this._resolveTLSPaths(connection);
    this._resolveSSHPaths(connection);
  }

  _resolveTLSPaths(connection) {
    if (connection.tls) {
      connection.tls.key = this._readIfExists(connection.tls.key);
      connection.tls.cert = this._readIfExists(connection.tls.cert);
      connection.tls.ca = this._readIfExists(connection.tls.ca);
    }
  }

  _resolveSSHPaths(connection) {
    if (connection.ssh) {
      connection.ssh.privateKey = this._readIfExists(connection.ssh.privateKey);
    }
  }

  _readIfExists(path) {
    if (path && fs.existsSync(path)) {
      return fs.readFileSync(path, { encoding: 'utf-8' });
    }
  }

  render() {
    const keyboardBindings = [
      { key: 'a', description: 'Add', handler: this._addConnection },
      { key: 'e', description: 'Edit', handler: this._editSelectedConnection },
      { key: 'd', description: 'Delete', handler: this._deleteSelectedConnection }
    ];

    return (
      <>
        <KeyboardBindings bindings={keyboardBindings}>
          <ConnectionList
            hidden={this.props.isLoading}
            onSelect={this._handleConnectionSelect}
            ref='list'
            connection={this.props.connection}
            connections={this.props.connections}
          />
        </KeyboardBindings>
        <Loader text='loading...' hidden={!this.props.isLoading} />
      </>
    );
  }
}

const mapStateToProps = ({ connections }) => ({
  connections: connections.list,
  isLoading: connections.isLoading
});
const mapDispatchToProps = {
  loadConnections: operations.loadConnections,
  editConnection: actions.editConnection,
  deleteConnection: operations.deleteConnection,
  connectToRedis: operations.connectToRedis
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectionListContainer);