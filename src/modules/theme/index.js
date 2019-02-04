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
  table: {
    header: { bold: true },
    selected: { bg: white }
  },
  list: {
    bg: blue,
    fg: yellow,
    border: { fg: cyan },
    scrollbar: { bg: green },
    label: { fg: white, bg: blue },
    item: { fg: yellow }
  },
  button: {
    fg: black,
    bg: lightGray,
    focus: {
      bg: green,
      fg: black
    }
  },
  dialog: {
    bg: white,
    fg: black,
    bold: true
  },
  header: { fg: yellow, bg: blue, bold: true },
  main: { bg: lightGray }
};
theme.loader = theme.box;

export default Object.freeze(theme);
