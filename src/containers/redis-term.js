import React, { Component } from 'react';
import { withRouter, Route } from 'react-router';
import PropTypes from 'prop-types';
import { withTheme } from '../contexts/theme-context';
import ConfigForm from './config-form';
import Database from './database';

class RedisTerm extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    connectToRedis: PropTypes.func.isRequired
  };

  _connectToRedis = async config => {
    const { connectToRedis, history } = this.props;
    await connectToRedis(config);
    history.push('/database');
  };

  render() {
    const { theme } = this.props;
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
      </box>
    );
  }
}

export default withRouter(withTheme(RedisTerm));
