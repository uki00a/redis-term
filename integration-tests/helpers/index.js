import React from 'react';
import { render as renderComponent } from './react-blessed';
import { Provider as StoreProvider } from 'react-redux';
import { applyMiddleware } from 'redux';
import configureStore from '../../src/modules/redux/store';
import thunk from 'redux-thunk';

export * from './redis';
export * from './react-blessed';

import { ThemeProvider } from '../../src/contexts/theme-context';

/**
 * @typedef {Partial<import('../../src/modules/redux/store').State>} PartialState
 * @typedef {import('../../src/modules/redis/facade').Facade} RedisFacade
 */

/**
 * @param {object} param0 
 * @param {PartialState} param0.state
 * @param {{ redis: RedisFacade }} param0.extraArgument
 */
export const createStore = ({ state, extraArgument }) => {
  return configureStore(state, extraArgument);
};

/**
 * @param {*} component 
 */
export const render = (
  component,
  store
) => {
  return renderComponent(
    <StoreProvider store={store}>
      <ThemeProvider>
        { component }
      </ThemeProvider>
    </StoreProvider>
  );
};

export const nextTick = () => new Promise(resolve => setImmediate(resolve));
export const wait = ms => new Promise(resolve => setTimeout(resolve));