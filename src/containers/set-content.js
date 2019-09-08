// @ts-check
import React, { useEffect, useRef, useState } from 'react';
import List from '../components/list';
import FilterableList from '../components/filterable-list';
import Editor from '../components/editor';
import Prompt from '../components/prompt';
import ScrollableBox from '../components/scrollable-box';
import ConfirmationDialog from '../components/confirmation-dialog';
import Loader from '../components/loader';
import KeyboardBindings from './keyboard-bindings';
import { withTheme } from '../contexts/theme-context';
import { useSet } from '../hooks/set';

/**
 * @this {never}
 * @param {*} param0 
 */
function _SetContentContainer({ keyName, redis, theme }) {
  const {
    members,
    isLoading,
    isSaving,
    pattern,
    addMember,
    deleteMember,
    loadMembers
  } = useSet({ keyName, redis });
  const [editingMemberIndex, setEditingMemberIndex] = useState(null);
  const hasEditingMember = editingMemberIndex != null;
  const editingValue = hasEditingMember
      ? members[editingMemberIndex]
      : '';
  const memberList = useRef(null);
  const addMemberPrompt = useRef(null);
  const confirmationDialog = useRef(null);
  const editor = useRef(null);

  useEffect(() => {
    loadMembers('');
  }, [keyName]); // eslint-disable-line

  if (isLoading) {
    return <Loader />;
  }

  const unselectMember = () => {
    setEditingMemberIndex(null);
  };

  const focusToMemberList = () => {
    memberList.current.focus();
  };

  const reload = async () => {
    unselectMember();
    await loadMembers(pattern);
    focusToMemberList();
  };

  const openAddMemberPrompt = () => {
    addMemberPrompt.current.open();
  };

  const closeAddMemberPrompt = () => {
    addMemberPrompt.current.close();
    focusToMemberList();
  };

  const openConfirmationDialog = () => {
    if (members.length > 0) {
      confirmationDialog.current.open();
    }
  };

  const handleMemberSelect = (item, index) => {
    setEditingMemberIndex(index);
  };

  const filter = async pattern => {
    unselectMember();
    await loadMembers(pattern);
    focusToMemberList();
  };

  const doAddMember = async newMember => {
    await addMember(newMember);
    focusToMemberList();
  };

  const removeHoveredMember = async () => {
    const index = memberList.current.selected();
    const memberToRemove = members[index];
    if (memberToRemove != null) {
      await deleteMember(memberToRemove);
    }
  };

  const list = (
    <KeyboardBindings bindings={[
      { key: 'C-r', handler: reload, description: 'Reload' },
      { key: 'a', handler: openAddMemberPrompt, description: 'Add Member' },
      { key: 'd', handler: openConfirmationDialog, description: 'Delete Member' }
    ]}>
      <List
        ref={memberList}
        items={members}
        onSelect={handleMemberSelect}
      />
    </KeyboardBindings>
  );

  return (
    <box style={theme.box}>
      <box
        style={theme.box}
        content={`SET: ${keyName}`}
        position={{ height: 1 }}
        bold
      />
      <FilterableList
        position={{ width: '50%', top: 1 }}
        List={list}
        filterList={filter}
        defaultPattern={pattern}
      />
      <ScrollableBox
        style={theme.box}
        position={{ left: '50%', top: 1, height: '90%' }}>
          <Editor
            ref={editor}
            position={{ height: 25, width: '95%' }}
            defaultValue={editingValue + ' '} // FIXME Workaround for lastcharcter disappeared
            disabled={true}
          />
        <Loader
          text='saving...'
          hidden={!isSaving}
          top={25}
        />
      </ScrollableBox>
      <Prompt
        position={{ height: 20 }}
        ref={addMemberPrompt}
        title='Add Member'
        onOk={doAddMember}
        onCancel={closeAddMemberPrompt}
      />
      <ConfirmationDialog
        text='Are you sure you want to delete this member'
        onOk={removeHoveredMember}
        onCancel={focusToMemberList}
        ref={confirmationDialog}
      />
    </box>
  );
}

export default withTheme(_SetContentContainer);