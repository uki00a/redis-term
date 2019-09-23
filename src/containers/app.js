import React, { Component } from 'react';
import { MemoryRouter } from 'react-router';
import { Provider as StoreProvider } from 'react-redux';
import PropTypes from 'prop-types';
import RedisTerm from './redis-term';
import { ThemeProvider } from '../contexts/theme-context';
import { ConnectionsContainer } from '../hooks/container';
import configureStore from '../modules/redux/store';
import RedisFacade from '../modules/redis/facade';

const redis = new RedisFacade();
const store = configureStore(undefined, { redis });

class App extends Component {
  static propTypes = {
    settings: PropTypes.object.isRequired
  };

  render() {
    return (
      <StoreProvider store={store}>
        <ConnectionsContainer.Provider>
          <ThemeProvider value={this.props.settings.colortheme}>
            <MemoryRouter initialEntries={['/connections']}>
              <RedisTerm redis={redis} />
            </MemoryRouter>
          </ThemeProvider>
        </ConnectionsContainer.Provider>
      </StoreProvider>
    );
  }
}

export default App;