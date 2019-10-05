import React from 'react';

export * from './redis';
export * from './blessed';
export { unmount } from './react-blessed';

import { ThemeProvider } from '../../src/contexts/theme-context';
import { KeyboardBindingsContainer } from '../../src/hooks/container';
import { createGetters, waitFor } from './blessed';
import { render as doRender } from './react-blessed';

// FIXME `Warning: Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported.`
export const render = (
  component,
  screen,
) => {
  doRender(
    <KeyboardBindingsContainer.Provider>
      <ThemeProvider>
        { component }
      </ThemeProvider>
    </KeyboardBindingsContainer.Provider>,
    screen
  );
  return createGetters(screen);
};

export const nextTick = () => new Promise(resolve => setImmediate(resolve));
export const wait = ms => new Promise(resolve => setTimeout(resolve));