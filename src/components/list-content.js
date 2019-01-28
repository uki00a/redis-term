import React, { Component } from 'react';
import Prompt from './prompt';
import PropTypes from 'prop-types';
import Editor from './editor';
import List from './list';

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

  render() {
    const selectedValue = this.state.selectedIndex == null
      ? null
      : this.props.elements[this.state.selectedIndex];

    return (
      <form>
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
        <box position={{ left: '50%', top: 1 }}>
          <Editor
            ref='editor'
            defaultValue={selectedValue}
            disabled={this.state.selectedIndex == null}
            position={{ height: 30 }}
          />
          <button
            clickable
            mouse
            position={{ top: 30, height: 3 }}
            tags
            border='line'
            onClick={this._save}
            content='{center}Save{/center}' />
          <button
            clickable
            mouse
            position={{ top: 33, height: 3 }}
            tags
            border='line'
            onClick={this._openAddRowPrompt}
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

export default ListContent;
