// @ts-check
import React, { useState, useEffect, useRef } from 'react';
import Loader from '../components/loader';
import Prompt from '../components/prompt';
import Editor from '../components/editor';
import List from '../components/list';
import ScrollableBox from '../components/scrollable-box';
import KeyboardBindings from './keyboard-bindings';
import { withTheme } from '../contexts/theme-context';

import { useList } from '../hooks/list';

/**
 * @this {never}
 */
function ListContentContainer({ keyName, redis, theme }) {
  const {
    elements,
    isLoading,
    isSaving,
    addElementToList,
    loadElements,
    updateElement
  } = useList({ redis, keyName });
  const [editingElementIndex, setEditingElementIndex] = useState(null);
  const editingElementValue = editingElementIndex == null
    ? null
    : elements[editingElementIndex];
  const box = useRef(null);
  const addElementPrompt = useRef(null);
  const elementList = useRef(null);
  const editor = useRef(null);

  const reload = async () => {
    await loadElements()
    elementList.current.focus();
  };

  const openAddElementPrompt = () => {
    addElementPrompt.current.open();
  };

  const closeAddElementPrompt = () => {
    addElementPrompt.current.close();
    elementList.current.focus();
  };

  const handleSelect = (item, index) => {
    setEditingElementIndex(index);
  };

  const saveEditingElement = async () => {
    if (editingElementIndex == null) {
      return;
    }
    const index = editingElementIndex;
    const value = editor.current.value();
    await updateElement(index, value)
    elementList.current.focus();
  };

  const addElement = async element => {
    await addElementToList(element);
    elementList.current.focus();
  };

  useEffect(() => {
    loadElements();
  }, [keyName]); // eslint-disable-line

  if (isLoading) {
    return <Loader />;
  }
  
  return (
    <box ref={box} style={theme.box}>
      <box
        style={theme.box}
        content={`LIST: ${keyName}`}
        position={{ height: 1 }}
        bold
      />
      <KeyboardBindings bindings={[
        { key: 'C-r', handler: reload, description: 'Reload' },
        { key: 'a', handler: openAddElementPrompt, description: 'Add Element' }
      ]}>
        <List
          ref={elementList}
          items={elements}
          position={{ width: '50%', top: 1 }}
          onSelect={handleSelect}
        />
      </KeyboardBindings>
      <ScrollableBox
        style={theme.box}
        position={{ left: '50%', top: 1, height: '90%' }}>
        <KeyboardBindings bindings={[
          { key: 'C-s', handler: saveEditingElement, description: 'Save' }
        ]}>
          <Editor
            ref={editor}
            defaultValue={editingElementValue}
            disabled={editingElementIndex == null}
            position={{ height: 30, width: '95%' }}
          />
        </KeyboardBindings>
        <Loader
          text='saving...'
          top={30}
          hidden={!isSaving}
        />
      </ScrollableBox>
      <Prompt
        ref={addElementPrompt}
        title='Add Element'
        onOk={addElement}
        onCancel={closeAddElementPrompt}
      />
    </box>
  );
}

export default withTheme(ListContentContainer);