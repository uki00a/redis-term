import React, { Component } from 'react';
import Prompt from './prompt';
import PropTypes from 'prop-types';
import Editor from './editor';
import List from './list';
import ScrollableBox from './scrollable-box';
import AddZsetMemberDialog from './add-zset-member-dialog';
import FilterableList from './filterable-list';
import ThemedButton from './themed-button';
import ConfirmationDialog from './confirmation-dialog';
import { withTheme } from '../contexts/theme-context';

class ZsetContent extends Component {
  static propTypes = {
    keyName: PropTypes.string.isRequired,
    members: PropTypes.array.isRequired,
    scores: PropTypes.array.isRequired,
    reload: PropTypes.func.isRequired,
    filterMembers: PropTypes.func.isRequired,
    saveMember: PropTypes.func.isRequired,
    addRow: PropTypes.func.isRequired,
    removeRow: PropTypes.func.isRequired,
    lastPattern: PropTypes.string,
    theme: PropTypes.object.isRequired
  };

  state = { selectedMemberIndex: null };

  _addRow = (score, value) => {
    this.props.addRow(value, score);
  };

  _removeRow = () => {
    if (!this._hasSelectedMember()) {
      return;
    }
    const memberToRemove = this._editingMember();
    this.props.removeRow(memberToRemove);
    this._unselectMember();
  };

  _openAddZsetMemberDialog = () => {
    this.refs.addZsetMemberDialog.open();
  };

  _openConfirmationDialog = () => {
    this.refs.confirmationDialog.open();
  };

  _hasSelectedMember() {
    return this.state.selectedMemberIndex != null;
  }

  _editingMember() {
    return this._hasSelectedMember()
      ? this.props.members[this.state.selectedMemberIndex]
      : '';
  }

  _editingScore() {
    return this._hasSelectedMember()
      ? this.props.scores[this.state.selectedMemberIndex]
      : '';
  }

  _saveMember = () => {
    if (!this._hasSelectedMember()) {
      return;
    }

    const oldValue = this.props.members[this.state.selectedMemberIndex];
    const newValue = this.refs.valueEditor.value();
    const newScore = this.refs.scoreEditor.value();

    this.props.saveMember(oldValue, newValue, newScore);
  };

  _onMemberSelected = (item, index) => {
    this.setState({ selectedMemberIndex: index });
  };

  _unselectMember() {
    this.setState({ selectedMemberIndex: null });
  }

  render() {
    const hasSelectedMember = this._hasSelectedMember();
    const editingMember = this._editingMember();
    const editingScore = this._editingScore();
    const memberList = (
      <List
        items={this.props.members}
        onSelect={this._onMemberSelected}
      />
    );

    return (
      <box style={this.props.theme.box}>
        <box
          style={this.props.theme.box}
          content={this.props.keyName}
          position={{ height: 1 }}
          bold
        />
        <ThemedButton
          position={{ height: 1, width: 8, right: 26 }}
          tags
          onClick={this._openAddZsetMemberDialog}
          content='{center}Add Row{/center}' />
        <ThemedButton
          disabled={!hasSelectedMember}
          position={{ height: 1, width: 11, right: 14 }}
          tags
          onClick={this._openConfirmationDialog}
          content='{center}Remove Row{/center}' />
        <ThemedButton
          position={{ width: 8, height: 1, right: 5 }}
          tags
          onClick={this.props.reload}
          content='{center}Reload{/center}' />
        <FilterableList
          List={memberList}
          filterList={this.props.filterMembers}
          defaultPattern={this.props.lastPattern}
          position={{ width: '50%', top: 1 }}         
        />
        <ScrollableBox
          style={this.props.theme.box}
          position={{ left: '50%', top: 1, height: '90%' }}>
          <Editor
            ref='scoreEditor'
            label='score'
            position={{ height: 5, width: '95%' }}
            defaultValue={editingScore}
            disabled={!hasSelectedMember}
          />
          <Editor
            ref='valueEditor'
            label='value'
            position={{ top: 5, height: 20, width: '95%' }}
            defaultValue={editingMember}
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
        <AddZsetMemberDialog
          position={{ height: 20 }}
          ref='addZsetMemberDialog'
          onOk={this._addRow}
        />
        <ConfirmationDialog
          text='Are you sure you want to delete this member'
          onOk={this._removeRow}
          ref='confirmationDialog'
        />
      </box>
    );
  }
}

export default withTheme(ZsetContent);
