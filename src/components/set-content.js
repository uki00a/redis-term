import React, { Component } from 'react';
import PropTypes from 'prop-types';
import List from './list';
import FilterableList from './filterable-list';
import Editor from './editor';
import Prompt from './prompt';
import ThemedButton from './themed-button';
import ScrollableBox from './scrollable-box';
import { withTheme } from '../contexts/theme-context';

class SetContent extends Component {
  static propTypes = {
    keyName: PropTypes.string.isRequired,
    members: PropTypes.array.isRequired,
    addRow: PropTypes.func.isRequired,
    removeRow: PropTypes.func.isRequired,
    reload: PropTypes.func.isRequired,
    filterMembers: PropTypes.func.isRequired,
    saveMember: PropTypes.func.isRequired,
    lastPattern: PropTypes.string,
    theme: PropTypes.object.isRequired
  };

  state = { selectedMemberIndex: null };

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
    this.setState({ selectedMemberIndex: index });
  };

  _unselectMember() {
    this.setState({ selectedMemberIndex: null });
  }

  _saveMember = () => {
    if (!this._hasSelectedMember()) {
      return;
    }

    const oldValue = this.props.members[this.state.selectedMemberIndex];
    const newValue = this.refs.editor.value();

    this.props.saveMember(oldValue, newValue);
  };

  _removeRow = () => {
    if (!this._hasSelectedMember()) {
      return;
    }
    const memberToRemove = this.props.members[this.state.selectedMemberIndex];
    this.props.removeRow(memberToRemove);
    this._unselectMember();
  };

  _hasSelectedMember() {
    return this.state.selectedMemberIndex != null;
  }

  _editingValue() {
    return this._hasSelectedMember()
      ? this.props.members[this.state.selectedMemberIndex]
      : '';
  }

  _renderMemberList = () => {
    return (
      <List
        items={this.props.members}
        onSelect={this._onMemberSelected}
      />
    );
  };

  render() {
    const hasSelectedMember = this._hasSelectedMember();
    const memberList = this._renderMemberList();

    return (
      <box style={this.props.theme.box}>
        <box
          style={this.props.theme.box}
          content={this.props.keyName}
          position={{ height: 1 }}
          bold
        />
        <ThemedButton
          position={{ height: 1, width: 8, right: 26  }}
          tags
          onClick={this._openAddRowPrompt}
          content='{center}Add Row{/center}' />
        <ThemedButton
          disabled={!hasSelectedMember}
          position={{ height: 1, width: 11, right: 14 }}
          tags
          onClick={this._removeRow}
          content='{center}Remove Row{/center}' />
        <ThemedButton
          position={{ height: 1, width: 8, right: 5 }}
          tags
          onClick={this.props.reload}
          content='{center}Reload{/center}' />
        <FilterableList
          position={{ width: '50%', top: 1 }}
          List={memberList}
          filterList={this.props.filterMembers}
          defaultPattern={this.props.lastPattern}
        />
        <ScrollableBox
          style={this.props.theme.box}
          position={{ left: '50%', top: 1, height: '90%' }}>
          <Editor
            ref='editor'
            position={{ height: 25, width: '95%' }}
            defaultValue={this._editingValue()}
            disabled={!hasSelectedMember}
          />
          <ThemedButton
            disabled={!hasSelectedMember}
            content='{center}Save{/center}'
            tags
            position={{ top: 25, left: 1, height: 1, width: 8 }}
            onClick={this._saveMember}
          />
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

export default withTheme(SetContent);
