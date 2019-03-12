const red = '#ff0000';
const white = '#ffffff';
const blue = '#0000d3';
const green = '#00cfd0';
const cyan = '#00ffff';
const black = '#000000';
const yellow = '#ffff00';
const lightGray = '#e7e7e7';

const theme = {
  box: {
    bg: blue,
    fg: yellow,
    border: { fg: white, bg: blue },
    scrollbar: { bg: green },
    label: { fg: white, bg: blue },
    focus: {
      border: { fg: cyan }
    }
  },
  list: {
    bg: blue,
    fg: yellow,
    scrollbar: { bg: green },
    label: { fg: white, bg: blue },
    item: { fg: yellow },
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
    },
    hover: {
      bg: green,
      fg: black
    }
  },
  dialog: {
    fg: black,
    bg: blue,
    bold: true
  },
  header: { fg: yellow, bg: blue, bold: true },
  main: { bg: lightGray },
  activeKeyboardBindings: {
    fg: yellow,
    bg: blue,
    bold: true
  }
};
theme.loader = theme.box;
theme.editor = theme.box;
theme.patternInput = theme.editor;

export default Object.freeze(theme);
