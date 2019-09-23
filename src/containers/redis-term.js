// @ts-check
import React, { Component } from 'react';
import { Route, withRouter } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTheme } from '../contexts/theme-context';
import ConnectionForm from './connection-form';
import Database from './database';
import ConnectionList from './connection-list';
import MessageDialog from '../components/message-dialog';
import ActiveKeyboardBindings from './active-keyboard-bindings';
import { actions as errorActions } from '../modules/redux/error';
import connectToRedis from '../modules/redis/connect-to-redis';

class RedisTerm extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    errorMessage: PropTypes.string,
    showError: PropTypes.func.isRequired,
    clearError: PropTypes.func.isRequired
  };

  state = {
    redis: null,
    isConnecting: false,
    editingConnection: null
  };

  _connectToRedis = async options => {
    if (this.state.isConnecting) {
      return;
    }
    this._disconnectFromRedisIfNeeded();
    this.setState({ isConnecting: true });
    try {
      const redis = await connectToRedis(options);
      this.setState({ redis });
    } finally {
      this.setState({ isConnecting: false });
    }
  };

  _disconnectFromRedisIfNeeded() {
    if (this.state.redis) {
      this._disconnectFromRedis();
    }
  }

  _disconnectFromRedis() {
    this.state.redis.disconnect();
    this.setState({ redis: null });
  }

  _editConnection = connection => {
    this.setState({ editingConnection: connection }, () => {
      this.props.history.push(`/connections/${connection.id}/edit`);
    });
  };

  _notifyError() {
    this.refs.errorMessageDialog.open();
  }

  _handleError = error => {
    this.props.showError(error);
  };

  componentDidCatch(error, info) { 
    this._handleError(error);
  }

  componentDidUpdate(prevProps) {
    if (this.props.errorMessage) {
      this._notifyError();
    }
  }

  componentDidMount() {
    this.refs.redisTerm.screen.key(['M-left', 'backspace'], () => {
      this._goToPreviousViewIfPossible();
    });

    process.on('unhandledRejection', this._handleError);
  }

  componentWillUnmount() {
    process.removeListener('unhandledRejection', this._handleError);
  }

  _goToPreviousViewIfPossible() {
    if (this.props.history.canGo(-1)) {
      this._goToPreviousView();
    }
  }

  _goToPreviousView() {
    this.props.history.goBack();
  }

  _onMessageDialogClosed = () => {
    this.props.clearError();
  };

  _formattedErrorMessage() {
    if (this.props.errorMessage) {
      return `{red-fg}{bold}${this.props.errorMessage}{/bold}{/red-fg}`;
    } else {
      return '';
    }
  }

  render() {
    const { theme } = this.props;
    return (
      <box ref='redisTerm' position={{ top: 0, left: 0, bottom: 0, right: 0 }} style={theme.header}>
        <text style={theme.header} content="redis-term" />
        <box position={{ top: 1, left: 0, right: 0, bottom: 2 }} style={theme.main}>
          <Route
            path='/connections'
            component={props => <ConnectionList
              {...props}
              editConnection={this._editConnection}
              connectToRedis={this._connectToRedis}
            />}
          />
          <Route
            path='/connections/new'
            render={props => <ConnectionForm {...props} isNew={true} />} />
          <Route
            path='/connections/:id/edit'
            render={props => <ConnectionForm {...props} isNew={false} connection={this.state.editingConnection} />} />
          <Route
            path='/database'
            render={props => <Database {...props} redis={this.state.redis} />} />
        </box>
        <ActiveKeyboardBindings />
        <MessageDialog
          onHide={this._onMessageDialogClosed}
          position={{ left: 'center', top: 'center', width: '80%' }}
          title='{red-fg}Error{/red-fg}'
          ref='errorMessageDialog'
          text={this._formattedErrorMessage()} />
      </box>
    );
  }
}

const mapStateToProps = state => ({ errorMessage: state.error.message });
const mapDispatchToProps = {
  showError: errorActions.showError,
  clearError: errorActions.clearError
};

export default withRouter(connect(
   mapStateToProps, 
   mapDispatchToProps
)(withTheme(RedisTerm)));
