import React, { Component } from 'react';
import { MemoryRouter } from 'react-router';
import { Provider as StoreProvider } from 'react-redux';
import PropTypes from 'prop-types';
import RedisTerm from './redis-term';
import { ThemeProvider } from '../contexts/theme-context';
import configureStore from '../modules/redux/store';

const store = configureStore();

class App extends Component {
  render() {
    return (
      <StoreProvider store={store}>
        <ThemeProvider>
          <MemoryRouter initialEntries={['/connections']}>
            <RedisTerm />
          </MemoryRouter>
        </ThemeProvider>
      </StoreProvider>
    );
  }
}

export default App;