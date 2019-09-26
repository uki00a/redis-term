import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import configureStore from '../../src/modules/redux/store';
import { createBlessedRenderer } from 'react-blessed';
import blessed from 'neo-blessed';

export * from './redis';
export * from './blessed';

import { ThemeProvider } from '../../src/contexts/theme-context';
import { KeyboardBindingsContainer } from '../../src/hooks/container';
import { createGetters, waitFor } from './blessed';

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

// FIXME `Warning: Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported.`
export const render = (
  component,
  screen,
  {
    store
  }
) => {
  const renderer = createBlessedRenderer(blessed);
  renderer(
    <StoreProvider store={store}>
      <KeyboardBindingsContainer.Provider>
        <ThemeProvider>
          { component }
        </ThemeProvider>
      </KeyboardBindingsContainer.Provider>
    </StoreProvider>,
    screen
  );
  return createGetters(screen);
};

export const nextTick = () => new Promise(resolve => setImmediate(resolve));
export const wait = ms => new Promise(resolve => setTimeout(resolve));