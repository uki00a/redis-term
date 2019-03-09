// @ts-check
import React, { Component } from 'react';
import { withRouter, Route } from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTheme } from '../contexts/theme-context';
import ConfigForm from './config-form';
import Database from './database';
import MessageDialog from '../components/message-dialog';
import { operations } from '../modules/redux/database';

class RedisTerm extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    connectToRedis: PropTypes.func.isRequired,
    error: PropTypes.any,
    database: PropTypes.object.isRequired
  };

  _connectToRedis = config => {
    this.props.connectToRedis(config);
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

    // TODO
    if (this.props.database.succeeded && prevProps.database.succeeded !== this.props.database.succeeded) {
      this.props.history.push('/database');
    }
  }

  render() {
    const { theme, error } = this.props;
    return (
      <box position={{ top: 0, left: 0, bottom: 0, right: 0 }} style={theme.header}>
        <text style={theme.header} content="redis-term" />
        <box position={{ top: 1, left: 0, right: 0, bottom: 2 }} style={theme.main}>
          <Route
            path='/connection'
            render={props => (
              <ConfigForm {...props} connectToRedis={this._connectToRedis} />
            )} />
          <Route
            path='/database'
            component={Database} />
        </box>
        <MessageDialog
          position={{ left: 'center', top: 'center', width: '80%' }}
          title='{red-fg}Error{/red-fg}'
          ref='errorMessageDialog'
          text={this._formatError(error)} />
      </box>
    );
  }
}

const mapStateToProps = state => ({ database: state.database });
const mapDispatchToProps = { connectToRedis: operations.connectToRedis };

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(withRouter(withTheme(RedisTerm)));
