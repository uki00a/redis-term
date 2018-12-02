import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createBlessedRenderer } from 'react-blessed';
import blessed from 'neo-blessed';
import App from './containers/app';
import ConfigForm from './containers/config-form';
import configureStore from './store';
import theme from './theme';

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
    <App>
      <ConfigForm theme={theme}> 
      </ConfigForm>
    </App>
  </Provider>,
  screen
);
