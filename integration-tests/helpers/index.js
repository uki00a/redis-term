import React from 'react';
import { createBlessedRenderer } from 'react-blessed';
import blessed from 'neo-blessed';

export * from './redis';
export * from './blessed';

import { ThemeProvider } from '../../src/contexts/theme-context';
import { KeyboardBindingsContainer } from '../../src/hooks/container';
import { createGetters, waitFor } from './blessed';

// FIXME `Warning: Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported.`
export const render = (
  component,
  screen,
) => {
  const renderer = createBlessedRenderer(blessed);
  renderer(
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