import React, { Component } from 'react';
import { MemoryRouter, Route } from 'react-router';
import PropTypes from 'prop-types';
import Redis from 'ioredis';
import ConfigForm from './config-form';
import Database from './database';
import { RedisProvider } from '../contexts/redis-context';
import { ThemeProvider, withTheme } from '../contexts/theme-context';

const RedisTerm = withTheme(({
  theme,
  connectToRedis
}) => (
  <box position={{ top: 0, left: 0, bottom: 0, right: 0 }} style={theme.header}>
    <text style={theme.header} content="redis-term" />
    <box position={{ top: 1, left: 0, right: 0, bottom: 2 }} style={theme.main}>
      <Route
        path='/connection'
        render={props => (
          <ConfigForm {...props} connectToRedis={connectToRedis} />
        )} />
      <Route
        path='/database'
        component={Database} />
    </box>
  </box>
));

class App extends Component {
  static propTypes = {
    screen: PropTypes.object.isRequired
  };

  state = { redis: null };

  connectToRedis = options => {
    const redis = new Redis(options);

    this.setState({ redis });
  };

  _handleError = error => {
    this.props.screen.debug(error);
  };

  componentDidCatch(err, info) { 
    this._handleError(err);
  }

  componentDidMount() {
    process.on('unhandledRejection', this._handleError);
  }

  componentWillUnmount() {
    process.removeListener('unhandledRejection', this._handleError);
  }

  render() {
    return (
      <RedisProvider value={this.state.redis}>
        <ThemeProvider>
          <MemoryRouter initialEntries={['/connection']}>
            <RedisTerm
              connectToRedis={this.connectToRedis} 
            />
          </MemoryRouter>
        </ThemeProvider>
      </RedisProvider>
    );
  }
}

export default App; 
