const ENABLE_KEYBOARD_BINDINGS = 'redis-term/keyboard-bindings/ENABLE_KEYBOARD_BINDINGS';

/**
 * @typedef {object} KeyboardBinding
 * @prop {string} key
 * @prop {string} description
 * @prop {Function} handler
 * 
 * @param {Array<KeyboardBinding>} keyboardBindings
 */
const enableKeyboardBindings = keyboardBindings => ({
  type: ENABLE_KEYBOARD_BINDINGS,  
  payload: keyboardBindings
});

/**
 * @typedef {Array<KeyboardBinding>} KeyboardBindingsState
 */
const initialState = [];

export const actions = { enableKeyboardBindings };

/**
 * @returns {KeyboardBindngsState}
 */
export default function reducer(state = initialState, action) {
  switch (action.type) {
  case ENABLE_KEYBOARD_BINDINGS:
    return action.payload;
  default:
    return state;
  }
}