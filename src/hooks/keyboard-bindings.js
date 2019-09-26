import { useState, useCallback } from 'react'

export function useKeyboardBindings() {
  const [keyboardBindings, setKeyboardBindings] = useState([]);
  const enableKeyboardBindings = useCallback(keyboardBindingsToEnable => setKeyboardBindings(
    keyboardBindings.concat(keyboardBindingsToEnable)
  ), [keyboardBindings]);
  const disableKeyboardBindings = useCallback(keyboardBindingsToDisable => {
    const keysToDisable = new Set(keyboardBindingsToDisable.map(x => x.key));
    setKeyboardBindings(keyboardBindings.filter(x => !keysToDisable.has(x.key)));
  }, [keyboardBindings]);

  return { keyboardBindings, enableKeyboardBindings, disableKeyboardBindings };
}
