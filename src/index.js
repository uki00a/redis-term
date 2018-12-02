import React, { Component } from 'react';
import { createBlessedRenderer } from 'react-blessed';
import blessed from 'neo-blessed';
import App from './containers/app';

const render = createBlessedRenderer(blessed);

const screen = blessed.screen({
  autopadding: true,
  smartCSR: true,
  title: 'redis-term',
  fullUnicode: true
});

screen.key(['escape'], (ch, key) => {
  process.exit(0);
});

const scan = ({
  redis,
  pattern = '*',
  count = 100
} = {}) => {
  async function loop(cursor, keys = []) {
    const [newCursor, fetchedKeys] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', count);
    const done = Number(newCursor) === 0;

    if (done) {
      return keys.concat(fetchedKeys);
    } else {
      return await loop(newCursor, keys.concat(fetchedKeys));
    }
  }

  return loop(0);
};
const connectToRedis = data => { 
  screen.destroy();

  const Redis = require('ioredis');
  const redis = new Redis({
    port: data.port, 
    host: data.host,
    family: 4,
    db: 0
  });

  scan({ redis })
    .then(keys => {
      console.log(keys); 
      process.exit(0);
    })
    .catch(error => {
      console.error(error); 
      process.exit(1);
    });
};

render(
  <App></App>,
  screen
);
