import React, { cloneElement, useEffect, useCallback } from 'react';
import { noop } from '../modules/utils';
import { useContainer, KeyboardBindingsContainer } from '../hooks/container';

/**
 * @this {never}
 */
function KeyboardBindings({
  bindings,
  children
}) {
  const { enableKeyboardBindings, disableKeyboardBindings } = useContainer(KeyboardBindingsContainer);

  useEffect(() => {
    return () => {
        doDisableKeyboardBindings();
    };
  }, []); // eslint-disable-line

  const doDisableKeyboardBindings = useCallback(() => {
    disableKeyboardBindings(bindings);
  }, [bindings, disableKeyboardBindings]);

  const handleFocus = useCallback(() => {
    enableKeyboardBindings(bindings);
  }, [enableKeyboardBindings, bindings]);

  const handleBlur = useCallback(() => {
    doDisableKeyboardBindings();
  }, [doDisableKeyboardBindings]);

  const doHandleKeypress =  useCallback((ch, key) => {
    handleKeypress(bindings, key);
  }, [bindings]);

  return cloneElement(children, {
    onFocus: handleFocus,
    onBlur: handleBlur,
    onKeypress: doHandleKeypress
  });
}

function handleKeypress(bindings, key) {
  const handler = _findHandlerFor(bindings, key) || noop;
  handler();
}

function _findHandlerFor(bindings, key) {
  const found = bindings.find(binding => key.full === binding.key);   
  return found && found.handler;
}

export default KeyboardBindings;