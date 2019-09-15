// @ts-check
import React, { useEffect, useRef } from 'react';
import KeyContent from './key-content';
import KeyboardBindings from './keyboard-bindings';
import KeyList from '../components/key-list';
import FilterableList from '../components/filterable-list';
import AddNewKeyDialog from '../components/add-new-key-dialog';
import ConfirmationDialog from '../components/confirmation-dialog';
import { enableTabFocus } from '../modules/blessed/helpers';
import { useKeys } from '../hooks/keys';

/**
 * @this {never}
 * @param {*} param0 
 */
function _Database({ redis, ...props }) {
  const {
    keys,
    pattern,
    selected,
    getKeys,
    addNewKey,
    deleteKey,
    selectKey,
    unselectKey
  } = useKeys({ redis });

  useEffect(() => {
    focusToKeyList();
    unselectKey();
    loadKeys()
    return enableTabFocus(root.current);
  }, [redis]); // eslint-disable-line

  const root = useRef(null);
  const addNewKeyDialog = useRef(null);
  const confirmationDialog = useRef(null);
  const keyList = useRef(null);

  const loadKeys = () => {
    getKeys('*');
  };

  const reloadKeys = () => {
    getKeys(pattern);
  };

  const filter = async pattern => {
    await getKeys(pattern);
    focusToKeyList();
  };

  const doAddNewKey = async (keyName, type) => {
    await addNewKey(keyName, type);
    focusToKeyList();
  };

  const deleteHoveredKey = async () => {
    const hoveredKeyIndex = keyList.current.selected();
    const hoveredKey = keys[hoveredKeyIndex];
    if (hoveredKey) {
      await deleteKey(hoveredKey);
      unselectKey();
    }
  };

  const focusToKeyList = () => {
    keyList.current.focus();
  };

  const openAddNewKeyDialog = () => addNewKeyDialog.current.open();
  const openConfirmationDialog = () => {
    if (keys.length > 0) {
      confirmationDialog.current.open();
    }
  };

  const handleKeySelect = (item, keyIndex) => {
    selectKey(keys[keyIndex]);
  };

  const list = (
    <KeyboardBindings bindings={[
    { key: 'f5', handler: loadKeys, description: 'Reload Keys' },
    { key: 'C-r', handler: reloadKeys, description: 'Reload Keys' },
    { key: 'a', handler: openAddNewKeyDialog, description: 'Add New Key' },
    { key: 'd', handler: openConfirmationDialog, description: 'Delete Selected Key' }
  ]}>
      <KeyList
        label='keys'
        ref={keyList}
        keys={keys}
        onSelect={handleKeySelect} />
    </KeyboardBindings>
  );

  return (
    <box ref={root} position={{ top: 1, left: 1, bottom: 2, right: 3 }}>
      <FilterableList 
        position={{left: 0, top: 0, bottom: 0, width: 30}}
        List={list}
        filterList={filter}
        { ...props }
      />
      <box position={{ left: 30, top: 0, right: 0 }}>
        <KeyContent
          redis={redis}
          keyName={selected.keyName}
          type={selected.type}>
        </KeyContent>
      </box>
      <AddNewKeyDialog
        ref={addNewKeyDialog}
        onOk={doAddNewKey} 
        onCancel={focusToKeyList}
      />
      <ConfirmationDialog
        text='Are you sure you want to delete this key?'
        onOk={deleteHoveredKey}
        onCancel={focusToKeyList}
        ref={confirmationDialog}
      />
    </box>
  );
}

export default _Database;
