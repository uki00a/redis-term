// @ts-check
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import List from '../components/list';
import FilterableList from '../components/filterable-list';
import Editor from '../components/editor';
import Prompt from '../components/prompt';
import ScrollableBox from '../components/scrollable-box';
import ConfirmationDialog from '../components/confirmation-dialog';
import Loader from '../components/loader';
import KeyboardBindings from './keyboard-bindings';
import { operations } from '../modules/redux/set';
import { withTheme } from '../contexts/theme-context';

class SetContentContainer extends Component {
  static propTypes = {
    keyName: PropTypes.string.isRequired,
    members: PropTypes.array,
    isLoading: PropTypes.bool.isRequired,
    isSaving: PropTypes.bool.isRequired,
    addMemberToSet: PropTypes.func.isRequired,
    deleteMemberFromSet: PropTypes.func.isRequired,
    filterSetMembers: PropTypes.func.isRequired
  };

  state = { editingMemberIndex: null };

  _openAddMemberPrompt = () => {
    this.refs.addMemberPrompt.open();
  };

  _closeAddMemberPrompt = () => {
    this.refs.addMemberPrompt.close();
    this._focusToMemberList();
  };

  _openConfirmationDialog = () => {
    if (this.props.members.length > 0) {
      this.refs.confirmationDialog.open();
    }
  };

  _addMember = async newMember => {
    this.props.addMemberToSet(newMember)
      .then(() => this._focusToMemberList());
  };

  _reload = () => {
    this._unselectMember();
    this.props.filterSetMembers(this.props.pattern).then(() => this._focusToMemberList());
  };

  _filterSetMembers = pattern => {
    this._unselectMember();
    this.props.filterSetMembers(pattern).then(() => this._focusToMemberList());
  };

  _removeHoveredMember = () => {
    const index = this._hoveredMemberIndex();    
    const memberToRemove = this.props.members[index];
    if (memberToRemove != null) {
      this._removeMember(memberToRemove);
    }
  };

  _removeMember(member) {
    this._unselectMember();
    this.props.deleteMemberFromSet(member)
      .then(() => this._focusToMemberList());
  }

  _hasEditingMember() {
    return this.state.editingMemberIndex != null;
  }

  _editingValue() {
    return this._hasEditingMember()
      ? this.props.members[this.state.editingMemberIndex]
      : '';
  }

  _onMemberSelected = (item, index) => {
    this.setState({ editingMemberIndex: index });
  };

  _unselectMember() {
    this.setState({ editingMemberIndex: null });
  }

  _hoveredMemberIndex() {
    return this.refs.memberList.selected();
  }

  _focusToMemberList = () => {
    this.refs.memberList.focus();
  };

  componentDidUpdate(prevProps) {
    if (this.props.keyName !== prevProps.keyName) {
      this.props.filterSetMembers('');
    }
  }

  componentDidMount() {
    this.props.filterSetMembers('');
  }

  render() {
    if (this.props.isLoading) {
      return <Loader />;
    } 

    const memberList = (
      <KeyboardBindings bindings={[
        { key: 'C-r', handler: this._reload, description: 'Reload' },
        { key: 'a', handler: this._openAddMemberPrompt, description: 'Add Member' },
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
          position={{ width: '50%', top: 1 }}
          List={memberList}
          filterList={this._filterSetMembers}
          defaultPattern={this.props.pattern}
        />
        <ScrollableBox
          style={this.props.theme.box}
          position={{ left: '50%', top: 1, height: '90%' }}>
            <Editor
              ref='editor'
              position={{ height: 25, width: '95%' }}
              defaultValue={this._editingValue() + ' '} // FIXME Workaround for lastcharcter disappeared
              disabled={true}
            />
          <Loader
            text='saving...'
            hidden={!this.props.isSaving}
            top={25}
          />
        </ScrollableBox>
        <Prompt
          position={{ height: 20 }}
          ref='addMemberPrompt'
          title='Add Member'
          onOk={this._addMember}
          onCancel={this._closeAddMemberPrompt}
        />
        <ConfirmationDialog
          text='Are you sure you want to delete this member'
          onOk={this._removeHoveredMember}
          onCancel={this._focusToMemberList}
          ref='confirmationDialog'
        />
      </box>
    );
  }
}

const mapStateToProps = ({ set }) => set;
const mapDispatchToProps = {
  addMemberToSet: operations.addMemberToSet,
  deleteMemberFromSet: operations.deleteMemberFromSet,
  filterSetMembers: operations.filterSetMembers
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTheme(SetContentContainer));

