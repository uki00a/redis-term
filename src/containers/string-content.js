// @ts-check
import React, { Component, useState, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import KeyboardBindings from './keyboard-bindings';
import Loader from '../components/loader';
import Editor from '../components/editor';
import ScrollableBox from '../components/scrollable-box';
import { withTheme } from '../contexts/theme-context';

function useString({ redis, keyName }) {
  const [string, setString] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [isSaving, setSaving] = useState(false);

  const loadString = useCallback(async () => {
    if (isLoading) {
      return;
    }
    setLoading(true);
    try {
      const string = await redis.get(keyName);
      setString(string);
    } finally {
      setLoading(false);
    }
  }, [isLoading, keyName, redis]);

  const saveString = useCallback(async newValue => {
    if (isSaving) {
      return;
    }
    setSaving(true);
    try {
      await redis.set(keyName, newValue);
      setString(newValue);
    } finally {
      setSaving(false);
    }
  }, [isSaving, keyName, redis]);

  useEffect(() => {
    loadString();
  }, [keyName]);

  return {
    string,
    isLoading,
    isSaving,
    loadString,
    saveString
  };
}
 
/**
 * @this {never}
 */
function StringContentContainer({
  keyName,
  redis,
  theme
}) {
  const {
    string,
    isLoading,
    isSaving,
    loadString,
    saveString
  } = useString({ keyName, redis });

  const root = useRef(null);
  const editor = useRef(null);

  const reloadString = () => {
    root.current.focus();
    loadString().then(() => editor.current.focus());
  };

  const doSaveString = () => {
    const newValue = editor.current.value();
    saveString(newValue);
  };

  if (isLoading) {
    return <Loader />;
  } else {
    return (
      <box ref={root}>
        <box style={theme.box}>
          <box
            style={theme.box}
            content={`STRING: ${keyName}`}
            position={{ height: 1 }}
            bold>
          </box>
          <ScrollableBox
            style={theme.box}
            position={{ top: 1, height: 30 }}>
            <KeyboardBindings bindings={[
              { key: 'C-r', handler: reloadString, description: 'Reload' },
              { key: 'C-s', handler: doSaveString, description: 'Save' }
            ]}>
              <Editor
                ref={editor}
                position={{
                  height: 30,
                  width: '95%'
                }}
                defaultValue={string} />
            </KeyboardBindings>
          </ScrollableBox>
          <Loader
            text='saving...'
            top={32}
            hidden={!isSaving} />
        </box>
      </box>
    );
  }
}

export default withTheme(StringContentContainer);