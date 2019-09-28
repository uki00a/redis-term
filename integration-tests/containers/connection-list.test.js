import React from 'react';
import ConnectionList from '../../src/containers/connection-list';
import { ConnectionsContainer } from '../../src/hooks/container'
import {
  connectToRedis,
  cleanupRedisConnection,
  render,
  waitFor,
  waitForElementToBeHidden,
  createScreen,
  unmount
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
    unmount(screen);
  }

  async function renderSubject({ screen, history }) {
    const subject = render(
      <ConnectionsContainer.Provider>
        <ConnectionList history={history} />
      </ConnectionsContainer.Provider>,
      screen
    );
    await waitForElementToBeHidden(() => subject.getBy(x => x.name === 'loader'));
    return subject;
  };
});