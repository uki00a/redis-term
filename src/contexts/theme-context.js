import React, { createContext, forwardRef, Component } from 'react';
import PropTypes from 'prop-types';
import theme from '../modules/theme'; 

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => (
  <ThemeContext.Provider value={theme}>
    { children } 
  </ThemeContext.Provider>
);

export const withTheme = Component => forwardRef((props, ref) => {
  return (
    <ThemeContext.Consumer>
      {
        theme => (
          <Component
            {...props}
            ref={ref} 
            theme={theme}
          />
        )
      }
    </ThemeContext.Consumer>
  );
});

