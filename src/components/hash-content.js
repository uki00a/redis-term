import React, { Component } from 'react';
import List from './list';
import Editor from './editor';
import PropTypes from 'prop-types';
import KeyValueDialog from './key-value-dialog';

class HashContent extends Component {
  static propTypes = {
    keyName: PropTypes.string.isRequired,
    hash: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    addRow: PropTypes.func.isRequired,
    saveField: PropTypes.func.isRequired,
    reload: PropTypes.func.isRequired
  };

  state = { selectedIndex: null };

  _addRow = (field, value) => this.props.addRow(field, value);
  _openAddKeyValueDialog = () => {
    this.refs.keyValueDialog.open();
  };

  _saveField = () => {
    if (this.state.selectedIndex == null) {
      return;
    }

    const fields = Object.keys(this.props.hash);
    const field = fields[this.state.selectedIndex];
    const newValue = this.refs.editor.value();

    this.props.saveField(field, newValue);
  };

  _onFieldSelected = (item, fieldIndex) => {
    this.setState({ selectedIndex: fieldIndex });
  };

  render() {
    const fields = Object.keys(this.props.hash);
    const selectedField = this.state.selectedIndex == null
      ? null
      : fields[this.state.selectedIndex];
    const selectedFieldValue = selectedField 
      ? this.props.hash[selectedField]
      : null;

    return (
      <form>
        <box
          content={this.props.keyName}
          position={{ width: '100%', height: 1 }}
          bold
        />
        <List
          items={fields}
          position={{ width: '50%', top: 1 }}
          style={this.props.theme.list}
          onSelect={this._onFieldSelected}
        />
        <box position={{ left: '50%', top: 1 }}>
          <Editor
            ref='editor'
            position={{ height: 30 }}
            defaultValue={selectedFieldValue}
            disabled={this.state.selectedIndex == null}
          />
          <button
            clickable
            mouse
            position={{ top: 30, height: 3 }}
            tags
            border='line'
            onClick={this._saveField}
            content='{center}Save{/center}' />
          <button
            clickable
            mouse
            position={{ top: 33, height: 3 }}
            tags
            border='line'
            onClick={this._openAddKeyValueDialog}
            content='{center}Add Row{/center}' />
          <button
            clickable
            mouse
            position={{ top: 36, height: 3 }}
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
