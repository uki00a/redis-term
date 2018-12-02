import React, { Component } from 'react';
import ConfigForm from './config-form';
import theme from '../theme';

const App = ({ children }) => {
  return (
    <box position={{ top: 0, left: 0, bottom: 0, right: 0 }} style={theme.header}>
      <text style={theme.header} content="redis-term" />
      <box position={{ top: 1, left: 0, right: 0, bottom: 2 }} style={theme.main}>
        {children}
      </box>
    </box>
  );
};

export default App; 
