import React, { Component } from 'react';
import Table from './table';
import PropTypes from 'prop-types';
import KeyValueDialog from './key-value-dialog';

class HashContent extends Component {
  static propTypes = {
    keyName: PropTypes.string.isRequired,
    value: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    addRow: PropTypes.func.isRequired,
    reload: PropTypes.func.isRequired
  };

  _addRow = pair => this.props.addRow(pair);
  _openAddKeyValueDialog = () => {
    this.refs.keyValueDialog.open();
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
        <Table
          data={data}
          position={{ width: '70%', top: 1 }}
        />
        <box position={{ left: '70%', top: 1 }}>
          <button
            clickable
            mouse
            position={{ height: 3 }}
            tags
            border='line'
            onClick={this._openAddKeyValueDialog}
            content='{center}Add Row{/center}' />
          <button
            clickable
            mouse
            position={{ height: 3, top: 3 }}
            tags
            border='line'
            onClick={this.props.reload}
            content='{center}Reload{/center}' />
        </box>
        <KeyValueDialog
          ref='keyValueDialog'
          theme={this.props.theme}
          onOk={this._addRow}
        />
      </form>
    );
  }
}

export default HashContent;
