import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router';
import { createBlessedRenderer } from 'react-blessed';
import blessed from 'neo-blessed';
import App from './containers/app';
import ConfigForm from './containers/config-form';
import configureStore from './store';

const setupScreen = () => {
  const screen = blessed.screen({
    autopadding: true,
    smartCSR: true,
    title: 'redis-term',
    fullUnicode: true
  });

  screen.key(['escape'], (ch, key) => {
    process.exit(0);
  });

  return screen;
};

const screen = setupScreen();
const store = configureStore({});
const render = createBlessedRenderer(blessed);

render(
  <Provider store={store}>
    <MemoryRouter initialEntries={['/connection']}>
      <App>
        <Route path='/connection' component={ConfigForm} />
      </App>
    </MemoryRouter>
  </Provider>,
  screen
);
