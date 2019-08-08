import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { applyMiddleware } from 'redux';
import configureStore from '../../src/modules/redux/store';
import { createBlessedRenderer } from 'react-blessed';
import blessed from 'neo-blessed';
import thunk from 'redux-thunk';

export * from './redis';
export * from './blessed';

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
      <ThemeProvider>
        { component }
      </ThemeProvider>
    </StoreProvider>,
    screen
  );
  return createGetters(screen);
};

const createGetters = screen => ({
  getByType: getByType(screen),
  getByContent: getByContent(screen)
});
const getByType = screen => type =>  {
  const found = findBy(screen, x => x.type === type);
  if (found == null) {
    throw new Error(`getByType(${type}): no element was found`);
  }
  return found;
}

const getByContent = screen => content => {
  const predicate = content instanceof RegExp
    ? x => x.getContent && content.test(x.getContent())
    : x => x.getContent && x.getContent() === content;
  const found = findBy(screen, predicate);
  if (found === null) {
    throw new Error(`getByContent(${content}): no element was found`);
  }
  return found;
};

function findBy(screen, predicate) {
  const queue = [screen];
  const seen = new Set();
  while (queue.length > 0) {
    const node = queue.pop();
    if (seen.has(node)) {
      throw new Error('invalid screen');
    }
    seen.add(node);
    if (predicate(node)) {
      return node;
    }
    for (const child of node.children) {
      queue.push(child);
    }
  }
}

export const nextTick = () => new Promise(resolve => setImmediate(resolve));
export const wait = ms => new Promise(resolve => setTimeout(resolve));