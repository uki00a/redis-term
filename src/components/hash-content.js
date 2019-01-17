import React, { Component } from 'react';
import Prompt from './prompt';
import PropTypes from 'prop-types';

class HashContent extends Component {
  static propTypes = {
    keyName: PropTypes.string.isRequired,
    value: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
  };

  _prepareTableData() {
    const header = [['row', 'key', 'value']];
    const rows = Object.keys(this.props.value).map((key, i) => {
      const rownum = i + 1;
      const value = this.props.value[key];
      const row = [rownum, key, value];

      return row;
    });
    const table = header.concat(rows);

    return table;
  }

  render() {
    const data = this._prepareTableData();

    return (
      <form>
        <box
          content={this.props.keyName}
          position={{ width: '100%', height: 1 }}
          bold
        />
        <listtable
          position={{ width: '70%', top: 1 }}
          data={data}
          border='line'
          alwaysScroll
          scrollbar
          scrollable
          clickable
          keys
          vi
        />
        <box position={{ left: '70%', top: 1 }}>
          <button
            clickable
            mouse
            position={{ height: 3 }}
            tags
            border='line'
            content='{center}Add Row{/center}' />
          <button
            clickable
            mouse
            position={{ height: 3, top: 3 }}
            tags
            border='line'
            content='{center}Reload{/center}' />
        </box>
      </form>
    );
  }
}

export default HashContent;
