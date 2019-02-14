import React, { Component } from 'react';
import Prompt from './prompt';
import PropTypes from 'prop-types';
import Editor from './editor';
import List from './list';
import ScrollableBox from './scrollable-box';
import AddZsetMemberDialog from './add-zset-member-dialog';
import FilterableList from './filterable-list';

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
    lastPattern: PropTypes.string
  };

  state = { selectedMemberIndex: null };

  _addRow = (score, value) => {
    this.props.addRow(score, value);
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
      <box>
        <box
          content={this.props.keyName}
          position={{ width: '100%', height: 1 }}
          bold
        />
        <FilterableList
          List={memberList}
          filterList={this.props.filterMembers}
          defaultPattern={this.props.lastPattern}
          position={{ width: '50%', top: 1 }}         
        />
        <ScrollableBox position={{ left: '50%', top: 1, height: '90%' }}>
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
            position={{ top: 5, height: 25, width: '95%' }}
            defaultValue={editingMember}
            disabled={!hasSelectedMember}
          />
          <button
            border='line'
            keys
            mouse
            content='{center}Save{/center}'
            tags
            position={{ top: 30, height: 3, width: '95%' }}
            onClick={this._saveMember}
          />
          <button
            clickable
            mouse
            position={{ top: 33, height: 3, width: '95%' }}
            tags
            border='line'
            onClick={this._openAddZsetMemberDialog}
            content='{center}Add Row{/center}' />
          <button
            clickable
            mouse
            position={{ top: 36, height: 3, width: '95%' }}
            tags
            border='line'
            onClick={this._removeRow}
            content='{center}Remove Row{/center}' />
          <button
            clickable
            mouse
            position={{ top: 39, height: 3, width: '95%' }}
            tags
            border='line'
            onClick={this.props.reload}
            content='{center}Reload{/center}' />
        </ScrollableBox>
        <AddZsetMemberDialog
          ref='addZsetMemberDialog'
          onOk={this._addRow}
        />
      </box>
    );
  }
}

export default ZsetContent;
