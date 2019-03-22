// @ts-check
import React, { Component } from 'react';
import { Route, withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { withTheme } from '../contexts/theme-context';
import ConnectionForm from './connection-form';
import Database from './database';
import ConnectionList from './connection-list';
import MessageDialog from '../components/message-dialog';
import ActiveKeyboardBindings from './active-keyboard-bindings';

class RedisTerm extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
  };

  state = { error: null };

  _notifyError() {
    this.refs.errorMessageDialog.open();
  }

  _formatError(error) {
    if (error) {
      return `{red-fg}{bold}${error.stack}{/bold}{/red-fg}`;
    } else {
      return '';
    }
  }

  _handleError = error => {
    this.setState({ error: this._formatError(error) });
  };

  componentDidCatch(error, info) { 
    this._handleError(error);
  }

  componentDidUpdate(prevProps) {
    if (this.state.error) {
      this._notifyError();
    }
  }

  componentDidMount() {
    setImmediate(() => {
      this.refs.redisTerm.screen.key(['M-left', 'backspace'], () => {
        this._goToPreviousViewIfPossible();
      });
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
    this.setState({ error: null })
  };

  render() {
    const { theme } = this.props;
    return (
      <box ref='redisTerm' position={{ top: 0, left: 0, bottom: 0, right: 0 }} style={theme.header}>
        <text style={theme.header} content="redis-term" />
        <box position={{ top: 1, left: 0, right: 0, bottom: 2 }} style={theme.main}>
          <Route
            path='/connections'
            component={ConnectionList} />
          <Route
            path='/connections/new'
            render={props => (
              <ConnectionForm {...props} isNew={true} connectToRedis={this._connectToRedis} />
            )} />
          <Route
            path='/connections/:id/edit'
            render={props => (
              <ConnectionForm {...props} isNew={false} connectToRedis={this._connectToRedis} />
            )} />
          <Route
            path='/database'
            component={Database} />
        </box>
        <ActiveKeyboardBindings />
        <MessageDialog
          onHide={this._onMessageDialogClosed}
          position={{ left: 'center', top: 'center', width: '80%' }}
          title='{red-fg}Error{/red-fg}'
          ref='errorMessageDialog'
          text={this.state.error || ''} />
      </box>
    );
  }
}

export default withRouter(withTheme(RedisTerm));
