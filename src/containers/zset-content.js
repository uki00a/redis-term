// @ts-check
import React, { useEffect, useState, useRef } from 'react';
import KeyboardBindings from './keyboard-bindings';
import Loader from '../components/loader';
import Editor from '../components/editor';
import List from '../components/list';
import ScrollableBox from '../components/scrollable-box';
import AddZsetMemberDialog from '../components/add-zset-member-dialog';
import FilterableList from '../components/filterable-list';
import ConfirmationDialog from '../components/confirmation-dialog';
import { withTheme } from '../contexts/theme-context';
import { useZset } from '../hooks/zset';

/**
 * @this {never}
 */
function ZsetContentContainer({
  keyName,
  redis,
  theme
}) {
  const {
    members,
    scores,
    isLoading,
    isSaving,
    pattern,
    loadMembersAndScores,
    addMemberAndScore,
    updateScore,
    deleteMember
  } = useZset({ keyName, redis });

  const memberList = useRef(null);
  const addZsetMemberDialog = useRef(null);
  const confirmationDialog = useRef(null);
  const scoreEditor = useRef(null);
  const valueEditor = useRef(null);
  const [editingMemberIndex, setEditingMemberIndex] = useState(null);
  const hasEditingMember = editingMemberIndex != null;
  const editingMember = hasEditingMember
    ? members[editingMemberIndex]
    : '';
  const editingScore = hasEditingMember
    ? scores[editingMemberIndex]
    : '';

  useEffect(() => {
    loadMembersAndScores('');
  }, [keyName]); // eslint-disable-line

  if (isLoading) {
    return <Loader />;
  }

  const reloadZset = async () => {
    await loadMembersAndScores(pattern)
    focusToMemberList();
  };

  const focusToMemberList = () => {
    memberList.current.focus();
  };

  const openAddZsetMemberDialog = () => {
    addZsetMemberDialog.current.open();
  };

  const openConfirmationDialog = () => {
    if (members.length > 0) {
      confirmationDialog.current.open();
    }
  };

  const handleMemberSelect = (item, index) => {
    setEditingMemberIndex(index);
  };

  const unselectMember = () => {
    setEditingMemberIndex(null);
  };

  const filter = async pattern => {
    unselectMember();
    await loadMembersAndScores(pattern);
    focusToMemberList();
  };

  const saveEditingMember = async () => {
    if (!hasEditingMember) {
      return;
    }

    const member = members[editingMemberIndex];
    const newScore = scoreEditor.current.value();
    await updateScore(member, newScore)
    focusToMemberList();
  };

  const doAddMemberAndScore = async (score, value) => {
    await addMemberAndScore(value, score);
    focusToMemberList();
  };

  const removeHoveredMemberIfExists = async () => {
    const index = memberList.current.selected();
    const memberToRemove = members[index];
    if (memberToRemove != null) {
      deleteMember(memberToRemove);
    }
  };

  const list = (
    <KeyboardBindings bindings={[
      { key: 'C-r', handler: reloadZset, description: 'Reload' },
      { key: 'a', handler: openAddZsetMemberDialog, description: 'Add Member' },
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
        content={`ZSET: ${keyName}`}
        position={{ height: 1 }}
        bold
      />
      <FilterableList
        List={list}
        filterList={filter}
        defaultPattern={pattern}
        position={{ width: '50%', top: 1 }}         
      />
      <ScrollableBox
        style={theme.box}
        position={{ left: '50%', top: 1, height: '90%' }}>
        <KeyboardBindings bindings={[
          { key: 'C-s', handler: saveEditingMember, description: 'Save' }
        ]}>
          <Editor
            ref={scoreEditor}
            label='score'
            position={{ height: 5, width: '95%' }}
            defaultValue={editingScore}
            disabled={!hasEditingMember}
          />
        </KeyboardBindings>
        <Editor
          ref={valueEditor}
          label='value'
          position={{ top: 5, height: 20, width: '95%' }}
          defaultValue={editingMember + ' '} // FIXME Workaround for last character disappeared
          disabled={true}
          keyable
        />
        <Loader
          text='saving...'
          hidden={!isSaving}
          top={25} 
        />
      </ScrollableBox>
      <AddZsetMemberDialog
        position={{ height: 20 }}
        ref={addZsetMemberDialog}
        onOk={doAddMemberAndScore}
        onCancel={focusToMemberList}
      />
      <ConfirmationDialog
        text='Are you sure you want to delete this member'
        onOk={removeHoveredMemberIfExists}
        onCancel={focusToMemberList}
        ref={confirmationDialog}
      />
    </box>
  );
}

export default withTheme(ZsetContentContainer);
