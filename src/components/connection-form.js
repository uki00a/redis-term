import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import Textbox from './textbox';
import ThemedButton from './themed-button';
import FileManager from './file-manager';
import { withTheme } from '../contexts/theme-context';

class ConnectionForm extends Component {
  static propTypes = {
    connection: PropTypes.object,
    theme: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.refs.form.focusNext();
  }

  _onSaveButtonClicked = () => {
    if (this.refs.form) { // FIXME - Workaround for `TypeError: Cannot read property 'submit' of undefined`
      this.refs.form.submit();
    }
  };

  _handleSubmit = options => {
    delete options.button;
    delete options['file-manager'];
    this.props.onSubmit(options);
  };

  _openFileManager = ref => {
    // TODO rename
    this._ref = ref;
    this.refs.fileManager.open();
  };

  _handleFileSelect = file => {
    this.refs[this._ref].setValue(file);
  };

  _onFileManagerHidden = () => {
    this.refs[this._ref].focus();
  };

  _renderInputGroup(index, label, name, initialValue = '', secure = false) {
    const boxHeight = 2;
    const boxOffset = boxHeight * index;
    return (
      <box position={{ left: 0, top: boxOffset, height: boxHeight }} style={this.props.theme.box}>
        <text
          content={label}
          style={this.props.theme.box}
          position={{ left: 0 }}>
        </text>
        <Textbox
          style={this.props.theme.textbox}
          censor={secure}
          name={name}
          value={initialValue}
          position={{ left: 13, height: 1, width: 16 }}>
        </Textbox>
      </box>
    );
  }

  _renderTLSInput(index, label, name, defaultValue = '') {
    const boxHeight = 2;
    const boxOffset = boxHeight * index;
    return (
      <box position={{ left: 0, top: boxOffset, height: boxHeight }} style={this.props.theme.box}>
        <text
          content={label}
          style={this.props.theme.box}
          position={{ left: 0 }}>
        </text>
        <Textbox
          style={this.props.theme.textbox}          
          ref={name}
          name={name}
          defaultValue={defaultValue}
          position={{ left: 14, height: 1, width: 16 }}>
        </Textbox>
        <ThemedButton
          position={{ left: 30, height: 1, width: 4 }}
          onPress={() => this._openFileManager(name)}>
        </ThemedButton>
      </box>
    );
  }

  _renderSSHInput(index, label, name, { defaultValue = '', withFileManager = false, secure = false } = {}) {
    const boxHeight = 2;
    const boxOffset = boxHeight * index;
    const buttonWidth = 4;
    const inputWidth = 16 + (withFileManager ? 0 : buttonWidth);
    return (
      <box position={{ left: 0, top: boxOffset, height: boxHeight }} style={this.props.theme.box}>
        <text
          content={label}
          style={this.props.theme.box}
          position={{ left: 0 }}>
        </text>
        <Textbox
          style={this.props.theme.textbox}
          censor={secure}
          ref={name}
          name={name}
          defaultValue={defaultValue}
          position={{ left: 14, height: 1, width: inputWidth }}>
        </Textbox>
        {
          withFileManager
            ? (
              <ThemedButton
                position={{ left: 30, height: 1, width: buttonWidth }}
                onPress={() => this._openFileManager(name)}>
              </ThemedButton>
            )
            : null
        }
      </box>
    );
  }

  render() {
    const theme = this.props.theme;
    const connection = this.props.connection || {};
    const boxStyle = Object.assign({}, theme.box, theme.box.focus);

    return (
      <form
        keys
        ref='form'
        border='line'
        shadow
        style={boxStyle}
        position={{ left: 'center', top: 'center', height: 32 }}
        onSubmit={this._handleSubmit}>
        <FileManager
          onHide={this._onFileManagerHidden}
          ref='fileManager'
          onFile={this._handleFileSelect} 
        />
        <box
          label='Database'
          border='line'
          style={theme.box}
          width={36}
          height={18}>
          <box position={{ left: 1, right: 1, top: 1, bottom: 1 }} style={theme.box}>
            {this._renderInputGroup(0, 'Name:', 'name', connection.name || '')}
            {this._renderInputGroup(1, 'Host:', 'host', connection.host == null ? '127.0.0.1' : connection.host)}
            {this._renderInputGroup(2, 'Port:', 'port', connection.port == null ? '6379' : connection.port)}
            {this._renderInputGroup(3, 'Unix Socket:', 'path', connection.path || '')}
            {this._renderInputGroup(4, 'Password:', 'password', connection.password || '', true)}
          </box>
        </box>
        <box
          label='SSL'
          border='line'        
          position={{ left: 36, top: 0, height: 10 }}
          style={theme.box}>
          <box position={{ left: 1, top: 1, height: 1, right: 1 }} style={theme.box}>
            {this._renderTLSInput(0, 'Private Key:', 'tlskey', get(connection, 'tls.key', ''))}
            {this._renderTLSInput(1, 'Certificate:', 'tlscert', get(connection, 'tls.cert', ''))}
            {this._renderTLSInput(2, 'CA:', 'tlsca', get(connection, 'tls.ca', ''))}
          </box>
        </box>
        <box
          label='SSH'
          border='line'
          position={{ left: 36, top: 10, height: 15 }}
          style={theme.box}>
          <box position={{ left: 1, top: 1, height: 1, right: 1 }} style={theme.box}>
            {this._renderSSHInput(0, 'Host:', 'sshhost', { defaultValue: get(connection, 'ssh.host', '')})}
            {this._renderSSHInput(1, 'Port:', 'sshport', { defaultValue: get(connection, 'ssh.port', '') })}
            {this._renderSSHInput(2, 'User:', 'sshusername', { defaultValue: get(connection, 'ssh.username', '') })}
            {this._renderSSHInput(3, 'Private Key:', 'sshprivateKey', {
              withFileManager: true,
              defaultValue: get(connection, 'ssh.privateKey', '')
            })}
            {this._renderSSHInput(4, 'Passphrase:', 'sshpassphrase', {
              secure: true,
              defaultValue: get(connection, 'ssh.passphrase', '')
            })}
            {this._renderSSHInput(5, 'Password:', 'sshpassword', {
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
              onPress={this._onSaveButtonClicked}>
            </ThemedButton>
          </box>
        </box>
      </form>
    );
  }
}

export default withTheme(ConnectionForm);
