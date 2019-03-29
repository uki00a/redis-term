import React, { Component } from 'react';
import { createBlessedRenderer } from 'react-blessed';
import blessed from 'neo-blessed';
import App from './containers/app';
import { readSettingsJSON } from './modules/config';

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

  return screen;
};

const main = async () => {
  const screen = setupScreen();
  const render = createBlessedRenderer(blessed);
  const settings = await readSettingsJSON();

  render(<App screen={screen} settings={settings} />, screen);
};

main();

