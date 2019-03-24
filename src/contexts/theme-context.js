import React, { createContext, forwardRef } from 'react';
import { initializeTheme } from '../modules/theme'; 

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children, value }) => (
  <ThemeContext.Provider value={initializeTheme(value)}>
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

