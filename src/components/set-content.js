import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Table from './table';
import Editor from './editor';
import Prompt from './prompt';

class SetContent extends Component {
  static propTypes = {
    keyName: PropTypes.string.isRequired,
    value: PropTypes.array.isRequired,
    theme: PropTypes.object.isRequired,
    addRow: PropTypes.func.isRequired,
    reload: PropTypes.func.isRequired,
    saveElement: PropTypes.func.isRequired
  };

  state = { editingIndex: null };

  _openAddRowPrompt = () => {
    this.refs.addRowPrompt.open();
  };

  _closeAddRowPrompt = () => {
    this.refs.addRowPrompt.close();
  };

  _addRow = value => {
    this._closeAddRowPrompt();
    this.props.addRow(value);
  };

  _onTableRowSelected = (item, index) => {
    const isHeaderRowSelected = index === 0;

    if (isHeaderRowSelected) {
      return;
    }

    this.setState({ editingIndex: index - 1 });
  };

  _saveElement = () => {
    if (this.state.editingIndex == null) {
      return;
    }

    const oldValue = this.props.value[this.state.editingIndex];
    const newValue = this.refs.editor.value();

    this.props.saveElement(oldValue, newValue);
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
    const editingValue = this.state.editingIndex == null
      ? ''
      : this.props.value[this.state.editingIndex];

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
          onSelect={this._onTableRowSelected}
        />
        <box position={{ left: '70%', top: 1 }}>
          <button
            clickable
            mouse
            position={{ height: 3 }}
            tags
            border='line'
            onClick={this._openAddRowPrompt}
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
        <Editor
          ref='editor'
          position={{ top: '50%', height: '40%' }}
          defaultValue={editingValue}
          disabled={this.state.editingIndex == null}
        />
        <box position={{ height: '8%', top: '92%', bottom: 0, right: 0 }}>
          <button
            border='line'
            keys
            mouse
            content='{center}Save{/center}'
            tags
            position={{ width: 8, right: 2, height: 3 }}
            onClick={this._saveElement}
          />
        </box>
        <Prompt
          ref='addRowPrompt'
          title='Add Row'
          theme={this.props.theme}
          onOk={this._addRow}
          onCancel={this._closeAddRowPrompt}
        />
      </form>
    );
  }
}

export default SetContent;
