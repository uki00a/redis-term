// @ts-check
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import KeyboardBindings from './keyboard-bindings';
import Loader from '../components/loader';
import Editor from '../components/editor';
import List from '../components/list';
import ScrollableBox from '../components/scrollable-box';
import AddZsetMemberDialog from '../components/add-zset-member-dialog';
import FilterableList from '../components/filterable-list';
import ThemedButton from '../components/themed-button';
import ConfirmationDialog from '../components/confirmation-dialog';
import { operations } from '../modules/redux/zset';
import { withTheme } from '../contexts/theme-context';

class ZsetContentContainer extends Component {
  static propTypes = {
    keyName: PropTypes.string.isRequired,
    members: PropTypes.array.isRequired,
    scores: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isSaving: PropTypes.bool.isRequired,
    pattern: PropTypes.string.isRequired,
    updateZsetMember: PropTypes.func.isRequired,
    addMemberToZset: PropTypes.func.isRequired,
    deleteMemberFromZset: PropTypes.func.isRequired,
    filterZsetMembers: PropTypes.func.isRequired
  };

  state = { editingMemberIndex: null };

  _onMemberSelected = (item, index) => {
    this.setState({ editingMemberIndex: index });
  };

  _unselectMember() {
    this.setState({ editingMemberIndex: null });
  }

  _loadZset = () => {
    this._unselectMember();
    this.props.filterZsetMembers(this.props.pattern)
      .then(() => this._focusToMemberList());
  };

  _filterZsetMembers = pattern => {
    this._unselectMember();
    this.props.filterZsetMembers(pattern)
      .then(() => this._focusToMemberList());
  };

  _addMember = (score, value) => {
    this.props.addMemberToZset(value, score)
      .then(() => this._focusToMemberList());
  };

  _saveEditingMember = () => {
    if (!this._hasEditingMember()) {
      return;
    }

    const member = this.props.members[this.state.editingMemberIndex];
    const newScore = this.refs.scoreEditor.value();
    this.props.updateZsetMember(member, newScore)
      .then(() => this._focusToMemberList());
  };

  _removeHoveredMemberIfExists = () => {
    const index = this._hoveredMemberIndex();
    const memberToRemove = this.props.members[index];
    if (memberToRemove) {
      this._removeMember(memberToRemove);
    }
  };

  _removeMember(memberToRemove) {
    this._unselectMember();
    this.props.deleteMemberFromZset(memberToRemove)
      .then(() => this._focusToMemberList());
  };

  _openAddZsetMemberDialog = () => {
    this.refs.addZsetMemberDialog.open();
  };

  _openConfirmationDialog = () => {
    this.refs.confirmationDialog.open();
  };

  _hoveredMemberIndex() {
    return this.refs.memberList.selected();
  }

  _hasEditingMember() {
    return this.state.editingMemberIndex != null;
  }

  _editingMember() {
    return this._hasEditingMember()
      ? this.props.members[this.state.editingMemberIndex]
      : '';
  }

  _editingScore() {
    return this._hasEditingMember()
      ? this.props.scores[this.state.editingMemberIndex]
      : '';
  }

  _focusToMemberList() {
    this.refs.memberList.focus();
  }

  async componentDidMount() {
    this._loadZset();
  }

  render() {
    if (this.props.isLoading) {
      return <Loader />;
    }

    const hasEditingMember = this._hasEditingMember();
    const editingMember = this._editingMember();
    const editingScore = this._editingScore();
    const memberList = (
      <KeyboardBindings bindings={[
        { key: 'C-r', handler: this._loadZset, description: 'Reload' },
        { key: 'a', handler: this._openAddZsetMemberDialog, description: 'Add Member' },
        { key: 'd', handler: this._openConfirmationDialog, description: 'Delete Member' }
      ]}>
        <List
          ref='memberList'
          items={this.props.members}
          onSelect={this._onMemberSelected}
        />
      </KeyboardBindings>
    );

    return (
      <box style={this.props.theme.box}>
        <box
          style={this.props.theme.box}
          content={this.props.keyName}
          position={{ height: 1 }}
          bold
        />
        <FilterableList
          List={memberList}
          filterList={this._filterZsetMembers}
          defaultPattern={this.props.pattern}
          position={{ width: '50%', top: 1 }}         
        />
        <ScrollableBox
          style={this.props.theme.box}
          position={{ left: '50%', top: 1, height: '90%' }}>
          <KeyboardBindings bindings={[
            { key: 'C-s', handler: this._saveEditingMember, description: 'Save' }
          ]}>
            <Editor
              ref='scoreEditor'
              label='score'
              position={{ height: 5, width: '95%' }}
              defaultValue={editingScore}
              disabled={!hasEditingMember}
            />
          </KeyboardBindings>
          <Editor
            ref='valueEditor'
            label='value'
            position={{ top: 5, height: 20, width: '95%' }}
            defaultValue={editingMember}
            disabled={true}
          />
          <Loader
            text='saving...'
            hidden={!this.props.isSaving}
            top={25} 
          />
        </ScrollableBox>
        <AddZsetMemberDialog
          position={{ height: 20 }}
          ref='addZsetMemberDialog'
          onOk={this._addMember}
        />
        <ConfirmationDialog
          text='Are you sure you want to delete this member'
          onOk={this._removeHoveredMemberIfExists}
          ref='confirmationDialog'
        />
      </box>
    );
  }
}

const mapStateToProps = ({ zset }) => zset;
const mapDispatchToProps = {
  filterZsetMembers: operations.filterZsetMembers,
  updateZsetMember: operations.updateZsetMember,
  addMemberToZset: operations.addMemberToZset,
  deleteMemberFromZset: operations.deleteMemberFromZset
};

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(withTheme(ZsetContentContainer));
