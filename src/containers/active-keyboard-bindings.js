import React from 'react';
import ActiveKeyboardBindings from '../components/active-keyboard-bindings';
import { KeyboardBindingsContainer, useContainer } from '../hooks/container';

const DEFAULT_KEYBORAD_BINDINGS = [
  { key: 'C-c', description: 'Quit' },
  { key: 'backspace', description: 'Back' }
];

function ActiveKeyboardBindingsContainer() {
  const { keyboardBindings } = useContainer(KeyboardBindingsContainer);

  return (
    <ActiveKeyboardBindings
      keyboardBindings={DEFAULT_KEYBORAD_BINDINGS.concat(keyboardBindings)}
    />
  );
}

export default ActiveKeyboardBindingsContainer;