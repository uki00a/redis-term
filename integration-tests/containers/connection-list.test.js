import React from 'react';
import ConnectionList from '../../src/containers/connection-list';
import { ConnectionsContainer } from '../../src/hooks/container'
import {
  connectToRedis,
  cleanupRedisConnection,
  createStore,
  render,
  waitFor,
  waitForElementToBeHidden,
  createScreen,
} from '../helpers';
import assert from 'assert';
import path from 'path';
import xdgBaseDir from 'xdg-basedir';
import td from 'testdouble';

describe('<ConnectionList>', () => {
  let screen;

  afterEach(cleanup);

  it('should display server list when mounted', async () => {
    screen = createScreen();

    td.replace(xdgBaseDir, 'cache', path.join(__dirname, '..', 'fixtures', '.cache'));

    const { getByType } = await renderSubject({ screen, history: {} });
    const expected = ['server-1', 'server-2'];
    const actual = getByType('list').ritems;
    assert.deepEqual(expected, actual);
  });

  function cleanup() {
    td.reset();
    screen.destroy();
  }

  async function renderSubject({ screen, history }) {
    // TODO remove this
    const store = createStore({ state: {} });
    const subject = render(
      <ConnectionsContainer.Provider>
        <ConnectionList history={history} />
      </ConnectionsContainer.Provider>,
      screen,
      { store }
    );
    await waitForElementToBeHidden(() => subject.getBy(x => x.name === 'loader'));
    return subject;
  };
});