import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import Textbox from './textbox';
import ThemedButton from './themed-button';
import Button from './button';
import FileManager from './file-manager';
import Form from './form';
import Loader from './loader';
import { withTheme } from '../contexts/theme-context';

/**
 * 
 * @this {never}
 */
function ConnectionForm(props) {
  const theme = props.theme;
  const connection = props.connection || {};
  const boxStyle = Object.assign({}, theme.box, theme.box.focus);

  const [currentRef, setCurrentRef] = useState(null);

  const refs = {
    form: useRef(null),
    fileManager: useRef(null),
    name: null
  };

  const { form, fileManager } = refs;

  const _handleSubmit = options => {
    delete options.button;
    delete options['file-manager'];
    props.onSubmit(options);
  };

  const openFileManager = ref => {
    // TODO rename
    setCurrentRef(ref);
    refs.fileManager.current.open();
  };

  const onFileManagerHidden = () => {
    refs[currentRef].current.focus();
  };

  const handleFileSelect = file => {
    refs[currentRef].current.setValue(file);
  };

  const onSaveButtonClicked = () => {
    if (refs.form.current) { // FIXME - Workaround for `TypeError: Cannot read property 'submit' of undefined`
      refs.form.current.submit();
    }
  };

  const renderInputGroup = (index, label, name, initialValue = '', secure = false) => {
    const ref = useRef(null);
    const boxHeight = 2;
    const boxOffset = boxHeight * index;

    refs[name] = ref;

    return (
      <box position={{ left: 0, top: boxOffset, height: boxHeight }} style={props.theme.box}>
        <text
          content={label}
          style={props.theme.box}
          position={{ left: 0 }}>
        </text>
        <Textbox
          style={props.theme.textbox}
          censor={secure}
          ref={ref}
          name={name}
          value={initialValue}
          position={{ left: 13, height: 1, width: 16 }}>
        </Textbox>
      </box>
    );
  };

  const renderTLSInput = (index, label, name, defaultValue = '') => {
    const ref = useRef(null);
    const boxHeight = 2;
    const boxOffset = boxHeight * index;

    refs[name] = ref;

    return (
      <box position={{ left: 0, top: boxOffset, height: boxHeight }} style={props.theme.box}>
        <text
          content={label}
          style={props.theme.box}
          position={{ left: 0 }}>
        </text>
        <Textbox
          style={props.theme.textbox}          
          ref={ref}
          name={name}
          defaultValue={defaultValue}
          position={{ left: 14, height: 1, width: 16 }}>
        </Textbox>
        <Button
          style={props.theme.searchButton}
          position={{ left: 30, height: 1, width: 4 }}
          onPress={() => openFileManager(name)}>
        </Button>
      </box>
    );
  };

  const renderSSHInput = (index, label, name, { defaultValue = '', withFileManager = false, secure = false } = {}) => {
    const ref = useRef(null);
    const boxHeight = 2;
    const boxOffset = boxHeight * index;
    const buttonWidth = 4;
    const inputWidth = 16 + (withFileManager ? 0 : buttonWidth);

    refs[name] = ref;

    return (
      <box position={{ left: 0, top: boxOffset, height: boxHeight }} style={props.theme.box}>
        <text
          content={label}
          style={props.theme.box}
          position={{ left: 0 }}>
        </text>
        <Textbox
          style={props.theme.textbox}
          censor={secure}
          ref={ref}
          name={name}
          defaultValue={defaultValue}
          position={{ left: 14, height: 1, width: inputWidth }}>
        </Textbox>
        {
          withFileManager
            ? (
              <Button
                style={props.theme.searchButton}
                position={{ left: 30, height: 1, width: buttonWidth }}
                onPress={() => openFileManager(name)}>
              </Button>
            )
            : null
        }
      </box>
    );
  };

  useEffect(() => {
    form.current.focusNext();
  }, []);

  return (
    <Form
      ref={form}
      border='line'
      shadow
      style={boxStyle}
      position={{ left: 'center', top: 'center', height: 32 }}
      onSubmit={_handleSubmit}>
      <FileManager
        onHide={onFileManagerHidden}
        ref={fileManager}
        onFile={handleFileSelect} 
      />
      <box
        label='Database'
        border='line'
        style={theme.box}
        width={36}
        height={18}>
        <box position={{ left: 1, right: 1, top: 1, bottom: 1 }} style={theme.box}>
          {renderInputGroup(0, 'Name:', 'name', connection.name || '')}
          {renderInputGroup(1, 'Host:', 'host', connection.host == null ? '127.0.0.1' : connection.host)}
          {renderInputGroup(2, 'Port:', 'port', connection.port == null ? '6379' : connection.port)}
          {renderInputGroup(3, 'Unix Socket:', 'path', connection.path || '')}
          {renderInputGroup(4, 'Password:', 'password', connection.password || '', true)}
        </box>
      </box>
      <box
        label='SSL'
        border='line'        
        position={{ left: 36, top: 0, height: 10 }}
        style={theme.box}>
        <box position={{ left: 1, top: 1, height: 1, right: 1 }} style={theme.box}>
          {renderTLSInput(0, 'Private Key:', 'tlskey', get(connection, 'tls.key', ''))}
          {renderTLSInput(1, 'Certificate:', 'tlscert', get(connection, 'tls.cert', ''))}
          {renderTLSInput(2, 'CA:', 'tlsca', get(connection, 'tls.ca', ''))}
        </box>
      </box>
      <box
        label='SSH'
        border='line'
        position={{ left: 36, top: 10, height: 15 }}
        style={theme.box}>
        <box position={{ left: 1, top: 1, height: 1, right: 1 }} style={theme.box}>
          {renderSSHInput(0, 'Host:', 'sshhost', { defaultValue: get(connection, 'ssh.host', '')})}
          {renderSSHInput(1, 'Port:', 'sshport', { defaultValue: get(connection, 'ssh.port', '') })}
          {renderSSHInput(2, 'User:', 'sshusername', { defaultValue: get(connection, 'ssh.username', '') })}
          {renderSSHInput(3, 'Private Key:', 'sshprivateKey', {
            withFileManager: true,
            defaultValue: get(connection, 'ssh.privateKey', '')
          })}
          {renderSSHInput(4, 'Passphrase:', 'sshpassphrase', {
            secure: true,
            defaultValue: get(connection, 'ssh.passphrase', '')
          })}
          {renderSSHInput(5, 'Password:', 'sshpassword', {
            secure: true,
            defaultValue: get(connection, 'ssh.password', '')
          })}
        </box>
      </box>
      <box 
        border='line'
        position={{ left: 36, top: 25, height: 4 }}
        style={theme.box}>
        <box position={{ left: 1, top: 1, height: 1, right: 1 }} style={theme.box}>
          <ThemedButton
            position={{ height: 1, width: 12 }}
            content='{center}Save{/center}'
            tags
            onPress={onSaveButtonClicked}>
          </ThemedButton>
        </box>
        <Loader
          top={1}
          height={1}
          left={14}
          width={12}
          hidden={!props.isSaving}
          text='saving...' />
      </box>
    </Form>
  );
}

ConnectionForm.propTypes = {
  connection: PropTypes.object,
  theme: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isSaving: PropTypes.bool.isRequired
};

export default withTheme(ConnectionForm);
