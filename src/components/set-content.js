import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Table from './table';
import Editor from './editor';
import Prompt from './prompt';

class SetContent extends Component {
  static propTypes = {
    keyName: PropTypes.string.isRequired,
    value: PropTypes.array.isRequired,
    theme: PropTypes.object.isRequired
  };

  _prepareTableData() {
    const header = [['row', 'value']];
    const rows = this.props.value.map((x, i) => {
      const rownum = i + 1;
      const row = [rownum, x];

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
          position={{ width: '70%', height: '48%', top: 1 }}
        />
        <box position={{ left: '70%', top: 1 }}>
          <button
            clickable
            mouse
            position={{ height: 3 }}
            tags
            border='line'
            onClick={() => {}}
            content='{center}Add Row{/center}' />
          <button
            clickable
            mouse
            position={{ height: 3, top: 3 }}
            tags
            border='line'
            onClick={() => {}}
            content='{center}Reload{/center}' />
        </box>
        <Editor
          position={{ top: '50%', height: '40%' }}
          defaultValue=''
        />
        <box position={{ height: '8%', top: '92%', bottom: 0, right: 0 }}>
          <button
            border='line'
            keys
            mouse
            content='{center}Save{/center}'
            tags
            position={{ width: 8, right: 2, height: 3 }}
          />
        </box>
        <Prompt
          ref='addRowPrompt'
          title='Add Row'
          theme={this.props.theme}
          onOk={() => {}}
          onCancel={() => {}}
        />
      </form>
    );
  }
}

export default SetContent;
