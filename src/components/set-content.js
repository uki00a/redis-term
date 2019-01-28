import React, { Component } from 'react';
import PropTypes from 'prop-types';
import List from './list';
import Editor from './editor';
import Prompt from './prompt';

class SetContent extends Component {
  static propTypes = {
    keyName: PropTypes.string.isRequired,
    members: PropTypes.array.isRequired,
    theme: PropTypes.object.isRequired,
    addRow: PropTypes.func.isRequired,
    reload: PropTypes.func.isRequired,
    saveElement: PropTypes.func.isRequired
  };

  state = { selectedIndex: null };

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

  _onMemberSelected = (item, index) => {
    this.setState({ selectedIndex: index });
  };

  _saveElement = () => {
    if (this.state.selectedIndex == null) {
      return;
    }

    const oldValue = this.props.members[this.state.selectedIndex];
    const newValue = this.refs.editor.value();

    this.props.saveElement(oldValue, newValue);
  };

  render() {
    const editingValue = this.state.selectedIndex == null
      ? ''
      : this.props.members[this.state.selectedIndex];

    return (
      <form>
        <box
          content={this.props.keyName}
          position={{ width: '100%', height: 1 }}
          bold
        />
        <List
          items={this.props.members}
          position={{ width: '50%', top: 1 }}
          style={this.props.theme.list}
          onSelect={this._onMemberSelected}
        />
        <box position={{ left: '50%', top: 1 }}>
          <Editor
            ref='editor'
            position={{ height: 30 }}
            defaultValue={editingValue}
            disabled={this.state.selectedIndex == null}
          />
          <button
            clickable
            mouse
            position={{ top: 30, height: 3 }}
            tags
            border='line'
            onClick={this._openAddRowPrompt}
            content='{center}Add Row{/center}' />
          <button
            clickable
            mouse
            position={{ top: 33, height: 3 }}
            tags
            border='line'
            onClick={this.props.reload}
            content='{center}Reload{/center}' />
          <button
            border='line'
            keys
            mouse
            content='{center}Save{/center}'
            tags
            position={{ top: 36, height: 3 }}
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
