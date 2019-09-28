// @ts-check
import React, { useEffect, useState, useRef } from 'react';
import isEmpty from 'lodash/isEmpty';
import KeyboardBindings from './keyboard-bindings';
import List from '../components/list';
import Editor from '../components/editor';
import AddHashFieldDialog from '../components/add-hash-field-dialog';
import ScrollableBox from '../components/scrollable-box';
import FilterableList from '../components/filterable-list';
import CofnfirmationDialog from '../components/confirmation-dialog';
import Loader from '../components/loader';
import { withTheme } from '../contexts/theme-context';
import { useHash } from '../hooks/hash';

/**
 * @this {never}
 */
function HashContentContainer({ keyName, redis, theme }) {
  const {
    hash,
    isLoading,
    isSaving,
    pattern,
    loadHash,
    addFieldToHash,
    setField,
    deleteField
  } = useHash({ keyName, redis });
  const [editingFieldIndex, setEditingFieldIndex] = useState(null);
  const fieldList = useRef(null);
  const addHashFieldDialog = useRef(null);
  const confirmationDialog = useRef(null);
  const editor = useRef(null);

  useEffect(() => {
    loadHash('');
  }, [keyName]); // eslint-disable-line

  if (isLoading) {
    return <Loader />;
  }
  
  const fields = Object.keys(hash);
  const hasEditingField = editingFieldIndex != null;
  const editingField = fields[editingFieldIndex];
  const editingFieldValue = hasEditingField ? hash[editingField] : '';

  const focusToFieldList = () => {
    fieldList.current.focus();
  };

  const unselectField = () => {
    setEditingFieldIndex(null);
  };

  const reloadHash = async () => {
    unselectField();
    await loadHash(pattern);
    focusToFieldList();
  };

  const _getHash = async pattern => {
    unselectField();
    await loadHash(pattern)
    focusToFieldList();
  };

  const openAddHashFieldDialog = () => {
    addHashFieldDialog.current.open();
  };

  const openConfirmationDialog = () => {
    if (!isEmpty(hash)) {
      confirmationDialog.current.open();
    }
  };

  const handleFieldSelect = (item, fieldIndex) => {
    setEditingFieldIndex(fieldIndex);
  };

  const saveEditingField = async () => {
    if (!hasEditingField) {
      return;
    }

    const field = editingField;
    const newValue = editor.current.value();
    await setField(field, newValue);
    focusToFieldList();
  };

  const doAddFieldToHash = async (key, value) => {
    await addFieldToHash(key, value);
    focusToFieldList();
  };

  const removeHoveredFieldIfExists = async () => {
    const fieldToRemove = fields[fieldList.current.selected()];
    if (fieldToRemove != null) {
      unselectField();
      await deleteField(fieldToRemove);
      focusToFieldList();
    }
  };

  const fieldsList = (
    <KeyboardBindings bindings={[
      { key: 'C-r', handler: reloadHash, description: 'Reload' },
      { key: 'a', handler: openAddHashFieldDialog, description: 'Add Field' },
      { key: 'd', handler: openConfirmationDialog, description: 'Delete Field' }
    ]}>
      <List
        ref={fieldList}
        items={fields}
        onSelect={handleFieldSelect}
      />
    </KeyboardBindings>
  );

  return (
    <form style={theme.box}>
      <box
        style={theme.box}
        content={`HASH: ${keyName}`}
        position={{ height: 1 }}
        bold
      />
      <FilterableList
        List={fieldsList}
        filterList={_getHash}
        position={{ width: '50%', top: 1 }}
        defaultPattern={pattern}
      />
      <ScrollableBox
        style={theme.box}
        position={{ left: '50%', top: 1, height: '90%' }}>
        <KeyboardBindings bindings={[
          { key: 'C-s', handler: saveEditingField, description: 'Save' }
        ]}>
          <Editor
            ref={editor}
            position={{ height: 25, width: '95%' }}
            defaultValue={editingFieldValue}
            disabled={!hasEditingField}
          />
        </KeyboardBindings>
        <Loader
          text='saving...' 
          hidden={!isSaving}
          top={25}
        />
      </ScrollableBox>
      <AddHashFieldDialog
        position={{ height: 20 }}
        ref={addHashFieldDialog}
        onOk={doAddFieldToHash}
        onCancel={focusToFieldList}
      />
      <CofnfirmationDialog
        text='Are you sure you want to delete this field'
        onOk={removeHoveredFieldIfExists}
        onCancel={focusToFieldList}
        ref={confirmationDialog}
      />
    </form>
  );
}

export default withTheme(HashContentContainer);