// @ts-check
import React, { Component } from 'react';
import { Route, withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { withTheme } from '../contexts/theme-context';
import ConnectionForm from './connection-form';
import Database from './database';
import MessageDialog from '../components/message-dialog';
import ActiveKeyboardBindings from './active-keyboard-bindings';

class RedisTerm extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    error: PropTypes.any
  };

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

  componentDidUpdate(prevProps) {
    if (this.props.error) {
      this._notifyError();
    }
  }

  componentDidMount() {
    this.refs.redisTerm.screen.key(['escape'], () => {
      this._goToPreviousViewIfPossible();
    });
  }

  _goToPreviousViewIfPossible() {
    if (this.props.history.canGo(-1)) {
      this._goToPreviousPage();
    }
  }

  _goToPreviousPage() {
    this.props.history.goBack();
  }

  render() {
    const { theme, keyboardBindings, error } = this.props;
    return (
      <box ref='redisTerm' position={{ top: 0, left: 0, bottom: 0, right: 0 }} style={theme.header}>
        <text style={theme.header} content="redis-term" />
        <box position={{ top: 1, left: 0, right: 0, bottom: 2 }} style={theme.main}>
          <Route
            path='/connection'
            render={props => (
              <ConnectionForm {...props} connectToRedis={this._connectToRedis} />
            )} />
          <Route
            path='/database'
            component={Database} />
        </box>
        <ActiveKeyboardBindings />
        <MessageDialog
          position={{ left: 'center', top: 'center', width: '80%' }}
          title='{red-fg}Error{/red-fg}'
          ref='errorMessageDialog'
          text={this._formatError(error)} />
      </box>
    );
  }
}

export default withRouter(withTheme(RedisTerm));
