import { useState, useCallback } from 'react';
import get from 'lodash/get';
import has from 'lodash/has';
import { ApplicationError } from '../modules/errors';

export function useError() {
  const [message, setMessage] = useState(null);
  const showError = useCallback(error => {
    setMessage(formatError(error));
  }, []);
  const clearError = useCallback(() => setMessage(null), []);
  
  return { message, showError, clearError };
}

function formatError(error) {
  if (ApplicationError.isPrototypeOf(get(error, 'constructor'))) {
    return error.message;
  } else if (has(error, 'stack')) {
    return error.stack;
  } else {
    return error.toString();
  }
}
