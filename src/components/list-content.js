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
    addElement: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    reload: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired
  };

  state = { selectedIndex: null };

  _openAddElementPrompt = () => {
    this.refs.addElementPrompt.open();
  };

  _closeAddElementPrompt = () => {
    this.refs.addElementPrompt.close();
  };

  _addElement = element => {
    this._closeAddElementPrompt();
    this.props.addElement(element);
  };

  _save = () => {
    if (this.state.selectedIndex == null) {
      return;
    }
    const index = this.state.selectedIndex;
    const value = this.refs.editor.value();

    this.props.save(index, value);
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
          onClick={this._openAddElementPrompt}
          content='{center}Add{/center}' />
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
          ref='addElementPrompt'
          title='Add Element'
          onOk={this._addElement}
          onCancel={this._closeAddElementPrompt}
         />
      </box>
    );
  }
}

export default withTheme(ListContent);
