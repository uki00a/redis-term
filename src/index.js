import React, { Component } from 'react';
import { createBlessedRenderer } from 'react-blessed';
import blessed from 'neo-blessed';

const render = createBlessedRenderer(blessed);

const buildTheme = () => {
  const red = '#ff0000';
  const white = '#ffffff';
  const blue = '#0000d3';
  const green = '#00cfd0';
  const cyan = '#00ffff';
  const black = '#000000';
  const yellow = '#ffff00';
  const lightGray = '#e7e7e7';

  return {
    box: {
      normal: {
        bg: blue,
        fg: yellow,
        border: { fg: white, bg: blue },
        scrollbar: { bg: green },
        label: { fg: white, bg: blue }
      },
      focus: {
        border: { fg: cyan }
      }
    },
    button: {
      fg: black,
      bg: lightGray,
      focus: {
        bg: green,
        fg: black
      }
    }
  };
};

class ConfigForm extends Component {
  onConnectButtonClicked = () => {
    this.refs.form.submit();
  };

  render() {
    const { theme } = this.props;
    const style = Object.assign({}, theme.box.normal, theme.box.focus);
    const textboxWidth = 16;

    return (
      <box
        border='line'
        style={style}
        position={{ left: 1, right: 1, top: 0, bottom: 0 }}>
        <form
          keys
          ref='form'
          style={style}
          position={{ left: 1, right: 1, top: 1, bottom: 1 }}
          onSubmit={this.props.onSubmit}>
          <box position={{ left: 0, top: 0, height: 2 }} style={style}>
            <text
              content='Name:'
              style={style}
              position={{ left: 0 }}>
            </text>
            <textbox
              keys
              inputOnFocus
              mouse
              name='name'
              value='FIXME'
              position={{ left: 6, height: 1, width: 16 }}>
            </textbox>
          </box>
          <box position={{ left: 0, top: 2, height: 2 }} style={style}>
            <text
              content='Host:'
              style={style}
              position={{ left: 0 }}
            ></text>
            <textbox
              keys
              inputOnFocus
              mouse
              name='host'
              value='127.0.0.1'
              position={{ left: 6, height: 1, width: 16 }}>
            </textbox>
          </box>
          <box position={{ left: 0, top: 4, height: 2 }} style={style}>
            <text
              content='Port:'
              style={style}
              position={{ left: 0 }}>
            </text>
            <textbox
              keys
              inputOnFocus
              mouse
              name='port'
              value='6379'
              position={{ left: 6, height: 1, width: 16 }}>
            </textbox>
          </box>
          <box position={{ left: 0, top: 6, height: 2 }} style={style}>
            <text
              content='Password:'
              style={style}
              position={{ left: 0 }}>
            </text>
            <textbox
              keys
              inputOnFocus
              mouse
              name='password'
              value=''
              position={{ left: 10, height: 1, width: 16 }}>
            </textbox>
          </box>
          <box position={{ left: 0, top: 8, height: 2 }} style={style}>
            <button
              keys
              mouse
              position={{ left: 36, height: 1, width: 16 }}
              style={theme.button}
              content=' Connect '
              onPress={this.onConnectButtonClicked}>
            </button>
          </box>
        </form>
      </box>
    );
  }
}

const screen = blessed.screen({
  autopadding: true,
  smartCSR: true,
  title: 'redis-term',
  fullUnicode: true
});

screen.key(['escape'], (ch, key) => {
  process.exit(0);
});

const theme = buildTheme();
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
  <ConfigForm theme={theme} onSubmit={connectToRedis}></ConfigForm>,
  screen
);
