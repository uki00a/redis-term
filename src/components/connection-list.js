import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ScrollableBox from './scrollable-box';
import List from './list';

class ConnectionList extends Component {
  static propTypes = {
    connections: PropTypes.array.isRequired
  };

  focus() {
    this.refs.list.focus();
  }

  selected() {
    return this.refs.list.selected();
  }

  render() {
    const { connections, ...restProps } = this.props;
   
    return (
      <ScrollableBox position={{ left: 'center', top: 'center', height: 32 }}>
        <List
          ref='list' 
          items={connections.map(x => x.name)}
          { ...restProps }
        />
      </ScrollableBox>
    );
  }
}

export default ConnectionList;