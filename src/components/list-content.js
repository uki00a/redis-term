import React, { Component } from 'react';
import Prompt from './prompt';
import PropTypes from 'prop-types';
import Editor from './editor';
import List from './list';
import ScrollableBox from './scrollable-box';
import ThemedButton from './themed-button';
import { withTheme } from '../contexts/theme-context';

class ListContent extends Component {
  static propTypes = {
    keyName: PropTypes.string.isRequired,
    elements: PropTypes.array.isRequired,
    addRow: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    reload: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired
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
      <box style={this.props.theme.box}>
        <box
          style={this.props.theme.box}
          content={this.props.keyName}
          position={{ height: 1 }}
          bold
        />
        <ThemedButton
          position={{ height: 1, width: 8, right: 14 }}
          tags
          onClick={this._openAddRowPrompt}
          content='{center}Add Row{/center}' />
        <ThemedButton
          position={{ height: 1, width: 8, right: 5 }}
          tags
          onClick={this.props.reload}
          content='{center}Reload{/center}' />
        <List
          items={this.props.elements}
          position={{ width: '50%', top: 1 }}
          onSelect={this._onSelect}
        />
        <ScrollableBox
          style={this.props.theme.box}
          position={{ left: '50%', top: 1, height: '90%' }}>
          <Editor
            ref='editor'
            defaultValue={this._editingValue()}
            disabled={this.state.selectedIndex == null}
            position={{ height: 30, width: '95%' }}
          />
          <ThemedButton
            disabled={this.state.selectedIndex == null}
            position={{ top: 30, left: 1, height: 1, width: 8 }}
            tags
            onClick={this._save}
            content='{center}Save{/center}' />
        </ScrollableBox>
        <Prompt
          ref='addRowPrompt'
          title='Add Row'
          onOk={this._addRow}
          onCancel={this._closeAddRowPrompt}
         />
      </box>
    );
  }
}

export default withTheme(ListContent);
