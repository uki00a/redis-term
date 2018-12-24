import React, { Component } from 'react';
import ConfigForm from './config-form';
import PropTypes from 'prop-types';
import theme from '../theme';

class App extends Component {
  static propTypes = {
    children: PropTypes.node,
    screen: PropTypes.object.isRequired
  };

  componentDidCatch(err, info) { 
    this.props.screen.debug(err);
  }

  render() {
    const { children } = this.props;

    return (
      <box position={{ top: 0, left: 0, bottom: 0, right: 0 }} style={theme.header}>
        <text style={theme.header} content="redis-term" />
        <box position={{ top: 1, left: 0, right: 0, bottom: 2 }} style={theme.main}>
          {children}
        </box>
      </box>
    );
  }
}

export default App; 
