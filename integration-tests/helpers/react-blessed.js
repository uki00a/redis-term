import { createBlessedRenderer } from 'react-blessed';
import blessed from 'neo-blessed';

import { createGetters } from './blessed';

const rendererByMountedScreen = new WeakMap();

// FIXME `Warning: Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported.`
export const render = (
  component,
  screen,
) => {
  const renderer = createBlessedRenderer(blessed);
  rendererByMountedScreen.set(screen, renderer);
  renderer(
    component,
    screen
  );
  return createGetters(screen);
};

export const unmount = screen => {
  const renderer = rendererByMountedScreen.get(screen);
  renderer(null, screen);  
  screen.destroy();
  rendererByMountedScreen.delete(screen);
};
