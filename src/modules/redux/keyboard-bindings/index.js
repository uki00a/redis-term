const ENABLE_KEYBOARD_BINDINGS = 'redis-term/keyboard-bindings/ENABLE_KEYBOARD_BINDINGS';
const DISABLE_KEYBOARD_BINDINGS = 'redis-term/keyboard-bindings/DISABLE_KEYBOARD_BINDINGS';

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

const disableKeyboardBindings = keyboardBindings => ({
  type: DISABLE_KEYBOARD_BINDINGS,
  payload: keyboardBindings
});

/**
 * @typedef {Array<KeyboardBinding>} KeyboardBindingsState
 */
const initialState = [];

export const actions = { enableKeyboardBindings, disableKeyboardBindings };

/**
 * @returns {KeyboardBindngsState}
 */
export default function reducer(state = initialState, action) {
  switch (action.type) {
  case ENABLE_KEYBOARD_BINDINGS:
    return state.concat(action.payload);
  case DISABLE_KEYBOARD_BINDINGS:
    {
      const keysToDisable = new Set(action.payload.map(x => x.key));
      return state.filter(x => !keysToDisable.has(x.key));
    }
  default:
    return state;
  }
}