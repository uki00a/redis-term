import React, { Component } from 'react';
import { MemoryRouter } from 'react-router';
import PropTypes from 'prop-types';
import Redis from 'ioredis';
import RedisTerm from './redis-term';
import { RedisProvider } from '../contexts/redis-context';
import { ThemeProvider } from '../contexts/theme-context';

class App extends Component {
  static propTypes = {
    screen: PropTypes.object.isRequired
  };

  state = { redis: null, error: null };

  connectToRedis = options => {
    const redis = new Redis(options);

    return new Promise((resolve, reject) => {
      const onError = error => {
        cleanupListeners();
        redis.disconnect();
        reject(error);
        this.componentDidCatch(error);
      };
      const onReady = () => {
        cleanupListeners();
        resolve();
        this.setState({ redis, error: null });
      };
      const cleanupListeners = () => {
        redis.removeListener('error', onError);
        redis.removeListener('ready', onReady);
      };

      redis.once('error', onError); 
      redis.once('ready', onReady);
    });
  };

  _handleError = error => {
    this.props.screen.debug(error);
    this.setState({ error });
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
              error={this.state.error}
            />
          </MemoryRouter>
        </ThemeProvider>
      </RedisProvider>
    );
  }
}

export default App; 
