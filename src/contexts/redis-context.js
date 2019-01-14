import React, { Component, createContext, forwardRef } from 'react';

const Context = createContext(null);

export const RedisProvider = Context.Provider;

// FIXME:
// Warning: Failed prop type: Invalid prop `component` of type `object` supplied to `Route`, expected `function`.
//     in Route (created by App)
//     in App
export const withRedis = BaseComponent => forwardRef((props, ref) => (
  <Context.Consumer>
    {
      redis => <BaseComponent {...props} ref={ref} redis={redis} />
    }
  </Context.Consumer>
));

