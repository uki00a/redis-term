// @ts-check
import clone from 'lodash/clone';

const red = '#ff0000';
const white = '#ffffff';
const blue = '#0000d3';
const green = '#00cfd0';
const cyan = '#00ffff';
const black = '#000000';
const yellow = '#ffff00';
const lightGray = '#e7e7e7';

/**
 * @typedef {object} BoxTheme
 * @prop {string} bg
 * @prop {string} fg
 * @prop {{ fg: string, bg: string }} border
 * @prop {{ bg: string }} scrollbar
 * @prop {{ fg: string, bg: string }} label
 * @prop {{ border: { fg: string } }} focus
 * 
 * @typedef {object} TextboxTheme
 * @prop {string} [fg]
 * @prop {string} [bg]
 * 
 * @typedef {object} ListTheme
 * @prop {string} bg
 * @prop {string} fg
 * @prop {{ bg: string }} scrollbar
 * @prop {{ fg: string, bg: string }} label
 * @prop {{ fg: string }} item
 * @prop {{ border: { fg: string } }} focus
 * 
 * @typedef {object} ButtonTheme
 * @prop {string} fg
 * @prop {string} bg
 * @prop {{ bg: string, fg: string}} focus
 * @prop {{ bg: string, fg: string }} hover
 * 
 * @typedef {object} DialogTheme
 * @prop {string} fg
 * @prop {string} bg
 * @prop {boolean} bold
 * 
 * @typedef {object} HeaderTheme
 * @prop {string} fg
 * @prop {string} bg
 * @prop {boolean} bold
 * 
 * @typedef {{ bg: string }} MainTheme
 * 
 * @typedef {object} ActiveKeyboardBindingsTheme
 * @prop {string} fg
 * @prop {string} bg
 * @prop {boolean} bold
 * 
 * @typedef {object} Theme
 * @prop {BoxTheme} box
 * @prop {TextboxTheme} textbox
 * @prop {ListTheme} list
 * @prop {ButtonTheme} button
 * @prop {DialogTheme} dialog
 * @prop {HeaderTheme} header
 * @prop {MainTheme} main
 * @prop {ActiveKeyboardBindingsTheme} activeKeyboardBindings
 */

/**
 * @type {{ dark: Theme, blue: Theme }}
 */
const themes = {
  dark: {
    box: {
      bg: black,
      fg: white,
      border: { fg: white, bg: black },
      scrollbar: { bg: lightGray },
      label: { fg: white, bg: black },
      focus: {
        border: { fg: red }
      }
    },
    textbox: {
      bg: white,
      fg: black
    },
    list: {
      bg: black,
      fg: white,
      scrollbar: { bg: lightGray },
      label: { fg: white, bg: black },
      item: { fg: lightGray },
      focus: {
        border: { fg: red }
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
      fg: white,
      bg: black,
      bold: true
    },
    header: { fg: white, bg: black, bold: true },
    main: { bg: lightGray },
    activeKeyboardBindings: {
      fg: black,
      bg: lightGray,
      bold: true
    }
  },
  blue: {
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
    textbox: {},
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
  }
};

/**
 * @param {'blue'} themeName
 */
export const initializeTheme = themeName => {
  const theme = clone(themes[themeName || 'dark']);
  theme.loader = theme.box;
  theme.editor = theme.box;
  theme.patternInput = theme.editor;
  return theme;
};
