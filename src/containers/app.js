import React, { Component } from 'react';
import { MemoryRouter } from 'react-router';
import PropTypes from 'prop-types';
import RedisTerm from './redis-term';
import { ThemeProvider } from '../contexts/theme-context';
import { ConnectionsContainer, KeyboardBindingsContainer } from '../hooks/container';
import RedisFacade from '../modules/redis/facade';

const redis = new RedisFacade();

class App extends Component {
  static propTypes = {
    settings: PropTypes.object.isRequired
  };

  render() {
    return (
      <KeyboardBindingsContainer.Provider>
        <ConnectionsContainer.Provider>
          <ThemeProvider value={this.props.settings.colortheme}>
            <MemoryRouter initialEntries={['/connections']}>
              <RedisTerm redis={redis} />
            </MemoryRouter>
          </ThemeProvider>
        </ConnectionsContainer.Provider>
      </KeyboardBindingsContainer.Provider>
    );
  }
}

export default App;