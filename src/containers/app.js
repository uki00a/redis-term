import React from 'react';
import { MemoryRouter } from 'react-router';
import PropTypes from 'prop-types';
import RedisTerm from './redis-term';
import { ThemeProvider } from '../contexts/theme-context';
import { ConnectionsContainer, KeyboardBindingsContainer } from '../hooks/container';

function App({ settings }) {
  return (
    <KeyboardBindingsContainer.Provider>
      <ConnectionsContainer.Provider>
        <ThemeProvider value={settings.colortheme}>
          <MemoryRouter initialEntries={['/connections']}>
            <RedisTerm />
          </MemoryRouter>
        </ThemeProvider>
      </ConnectionsContainer.Provider>
    </KeyboardBindingsContainer.Provider>
  );
}

App.propTypes = {
  settings: PropTypes.object.isRequired
};

export default App;