import React, { Component } from 'react';
import Prompt from './prompt';
import PropTypes from 'prop-types';
import Editor from './editor';
import List from './list';
import ScrollableBox from './scrollable-box';

class ListContent extends Component {
  static propTypes = {
    keyName: PropTypes.string.isRequired,
    elements: PropTypes.array.isRequired,
    theme: PropTypes.object.isRequired,
    addRow: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    reload: PropTypes.func.isRequired
  };

  state = { selectedIndex: null };

  _openAddRowPrompt = () => {
    this.refs.addRowPrompt.open();
  };

  _closeAddRowPrompt = () => {
    this.refs.addRowPrompt.close();
  };

  _addRow = element => {
    this._closeAddRowPrompt();
    this.props.addRow(element);
  };

  _save = () => {
    if (this.state.selectedIndex == null) {
      return;
    }
    const index = this.state.selectedIndex;
    const value = this.refs.editor.value();

    this.props.save(value, index);
  };

  _onSelect = (item, index) => {
    this.setState({ selectedIndex: index });
  };

  _editingValue() {
    return this.state.selectedIndex == null
      ? null
      : this.props.elements[this.state.selectedIndex];
  }

  render() {
    return (
      <box>
        <box
          content={this.props.keyName}
          position={{ width: '100%', height: 1 }}
          bold
        />
        <List
          items={this.props.elements}
          position={{ width: '50%', top: 1 }}
          style={this.props.theme.list}
          onSelect={this._onSelect}
        />
        <ScrollableBox
          position={{ left: '50%', top: 1, height: '90%' }}>
          <Editor
            ref='editor'
            defaultValue={this._editingValue()}
            disabled={this.state.selectedIndex == null}
            position={{ height: 30, width: '95%' }}
          />
          <button
            clickable
            mouse
            position={{ top: 30, height: 3, width: '95%' }}
            tags
            border='line'
            onClick={this._save}
            content='{center}Save{/center}' />
          <button
            clickable
            mouse
            position={{ top: 33, height: 3, width: '95%' }}
            tags
            border='line'
            onClick={this._openAddRowPrompt}
            content='{center}Add Row{/center}' />
          <button
            clickable
            mouse
            position={{ top: 36, height: 3, width: '95%' }}
            tags
            border='line'
            onClick={this.props.reload}
            content='{center}Reload{/center}' />
        </ScrollableBox>
        <Prompt
          ref='addRowPrompt'
          title='Add Row'
          theme={this.props.theme}
          onOk={this._addRow}
          onCancel={this._closeAddRowPrompt}
         />
      </box>
    );
  }
}

export default ListContent;
