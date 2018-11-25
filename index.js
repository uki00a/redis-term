'use strict';


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
    }
  };
};

const buildUI = () => {
  const blessed = require('neo-blessed');
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

  screen.append(buildConfigForm(blessed, Object.assign({}, theme.box.normal, theme.box.focus)));

  screen.render();
};

const buildConfigForm = (blessed, style) => {
  // https://github.com/sqlectron/sqlectron-term/blob/master/src/widgets/server-form.js
  // https://itunes.apple.com/app/medis-gui-for-redis/id1063631769
  const configFormBox = blessed.box({
    border: 'line',
    style: style,
    position: { left: 0, right: 0, top: 0, bottom: 0 }
  });
  const form = blessed.form({
    keys: true,
    style: style,
    position: { left: 1, right: 1, top: 1, bottom: 1 }
  });
  const wrap = (label, input, options) => {
    const box = blessed.box(options);
    box.append(label);
    box.append(input);
    return box;
  };
  const name = wrap(
    blessed.text({
      content: 'Name:',
      style: style,
      position: { left: 0 }
    }),
    blessed.textbox({
      keys: true,
      inputOnFocus: true,
      mouse: true,
      name: 'name',
      value: 'FIXME',
      position: { left: 6, height: 1 }
    }),
    { position: { left: 0, top: 0, height: 2 }, style: style }
  );
  const host = wrap(
    blessed.text({
      content: 'Host:',
      style: style,
      position: { left: 0 }
    }),
    blessed.textbox({
      keys: true,
      inputOnFocus: true,
      mouse: true,
      name: 'host',
      value: '127.0.0.1',
      position: { left: 6, height: 1 }
    }),
    { position: { left: 0, top: 2, height: 2 }, style: style }
  );
  const port = wrap(
    blessed.text({
      content: 'Port:',
      style: style,
      position: { left: 0 }
    }),
    blessed.textbox({
      keys: true,
      inputOnFocus: true,
      mouse: true,
      name: 'port',
      value: '6379',
      position: { left: 6, height: 1 }
    }),
    { position: { left: 0, top: 4, height: 2 }, style: style }
  );
  const password = wrap(
    blessed.text({
      content: 'Password:',
      style: style,
      position: { left: 0 }
    }),
    blessed.textbox({
      keys: true,
      inputOnFocus: true,
      mouse: true,
      name: 'password',
      value: '',
      position: { left: 10, height: 1 }
    }),
    { position: { left: 0, top: 6, height: 2 }, style: style }
  );

  form.append(name);
  form.append(host);
  form.append(port);
  form.append(password);
  configFormBox.append(form);
  return configFormBox;
};

buildUI();

const connectToRedis = () => {
  const Redis = require('ioredis'); 

  const redis = new Redis({
    port: 6379,
    host: '127.0.0.1',
    family: 4,
    //password: 'auth',
    db: 0
  });
};


