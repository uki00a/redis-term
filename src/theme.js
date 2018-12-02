const red = '#ff0000';
const white = '#ffffff';
const blue = '#0000d3';
const green = '#00cfd0';
const cyan = '#00ffff';
const black = '#000000';
const yellow = '#ffff00';
const lightGray = '#e7e7e7';

export default Object.freeze({
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
  },
  header: { fg: yellow, bg: blue, bold: true },
  main: { bg: lightGray }
});
