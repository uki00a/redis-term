import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ConnectionList from '../components/connection-list';
import KeyboardBindings from './keyboard-bindings';
import { operations, actions } from '../modules/redux/connections';

class ConnectionListContainer extends Component {
  static propTypes = {
    connections: PropTypes.array.isRequired,
    loadConnections: PropTypes.func.isRequired,
    editConnection: PropTypes.func.isRequired,
    deleteConnection: PropTypes.func.isRequired,
    connectToRedis: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
  };

  componentDidMount() {
    this._loadConnectionsIfNotLoaded();
    this.refs.list.focus();
  }

  componentDidUpdate() {
    this.refs.list.focus();
  }

  _loadConnectionsIfNotLoaded() {
    if (this.props.connections.length === 0) {
      this.props.loadConnections();
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
    this.props.deleteConnection(connection);
  };

  _getSelectedConnection() {
    const connectionIndex = this.refs.list.selected();
    const connection = this.props.connections[connectionIndex];
    return connection;
  }

  _handleConnectionSelect = (item, connectionIndex) => {
    const connection = this.props.connections[connectionIndex];
    this.props.connectToRedis(connection)
      .then(() => this.props.history.push('/database'));
  };

  render() {
    const keyboardBindings = [
      { key: 'a', description: 'Add', handler: this._addConnection },
      { key: 'e', description: 'Edit', handler: this._editSelectedConnection },
      { key: 'd', description: 'Delete', handler: this._deleteSelectedConnection }
    ];

    return (
      <KeyboardBindings bindings={keyboardBindings}>
        <ConnectionList
          onSelect={this._handleConnectionSelect}
          ref='list'
          connection={this.props.connection}
          connections={this.props.connections}
        />
      </KeyboardBindings>
    );
  }
}

const mapStateToProps = ({ connections }) => ({
  connections: connections.list
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