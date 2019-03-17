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
    history: PropTypes.object.isRequired
  };

  componentDidMount() {
    this._loadConnectionsIfNotLoaded();
    this.refs.list.focus();
  }

  componentDidUpdate() {
    if (this.props.activeConnection) {
      this.props.history.push('/database');
    } else {
      this.refs.list.focus();
    }
  }

  _loadConnectionsIfNotLoaded() {
    if (this.props.connections.length === 0) {
      this.props.loadConnections();
    }
  }

  _addConnection = () => {
    this.props.history.push('/connections/new');
  };

  _editConnection = () => {
    const connectionIndex = this.refs.list.selected();
    const connection = this.props.connections[connectionIndex];
    this.props.editConnection(connection);
    this.props.history.push(`/connections/${connection.id}/edit`);
  };

  _handleConnectionSelect = (item, connectionIndex) => {
    const connection = this.props.connections[connectionIndex];
    this.props.connectToRedis(connection);
  };

  render() {
    const keyboardBindings = [
      { key: 'C-a', description: 'Add', handler: this._addConnection },
      { key: 'C-e', description: 'Edit', handler: this._editConnection }
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
  connections: connections.list,
  activeConnection: connections.activeConnection
});
const mapDispatchToProps = {
  loadConnections: operations.loadConnections,
  editConnection: actions.editConnection,
  connectToRedis: operations.connectToRedis
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectionListContainer);