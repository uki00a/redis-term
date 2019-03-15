import React, { Component } from 'react';
import { createBlessedRenderer } from 'react-blessed';
import blessed from 'neo-blessed';
import App from './containers/app';

const setupScreen = () => {
  const isDevMode = process.env.NODE_ENV !== 'production';
  const screen = blessed.screen({
    autopadding: true,
    smartCSR: true,
    title: 'redis-term',
    fullUnicode: true,
    debug: isDevMode
  });

  screen.key(['C-c'], (ch, key) => {
    process.exit(0);
  });

  screen.key(['tab'], (ch, key) => {
    screen.focusNext();
  });

  return screen;
};

const screen = setupScreen();
const render = createBlessedRenderer(blessed);

render(<App screen={screen} />, screen);
