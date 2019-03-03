import fs from 'fs';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Textbox from './textbox';
import ThemedButton from './themed-button';
import FileManager from './file-manager';
import { withTheme } from '../contexts/theme-context';

class ConfigForm extends Component {
  static propTypes = {
    theme: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired
  };

  onConnectButtonClicked = () => {
    this.refs.form.submit();
  };

  _handleSubmit = options => {
    const normalizedOptions = this._normalizeTLSOptions(options);
    this.props.onSubmit(normalizedOptions);
  };

  _normalizeTLSOptions(options) {
    if (this._containsTLSOptions(options)) {
      // TODO cleanup
      const { tlskey, tlscert, tlsca, ...restOptions } = options;
      restOptions.tls = {};
      restOptions.tls.key = this._readIfExists(tlskey);
      restOptions.tls.cert = this._readIfExists(tlscert);
      restOptions.tls.ca = this._readIfExists(tlsca);
      return restOptions;
    } else {
      return options;
    }
  }

  _containsTLSOptions(options) {
    const tlsOptions = ['tlskey', 'tlscert', 'tlsca'];
    return tlsOptions.some(option => options[option]);
  }

  _readIfExists(path) {
    if (fs.existsSync(path)) {
      return fs.readFileSync(path);
    }
  }

  _openFileManager = ref => {
    // TODO rename
    this._ref = ref;
    this.refs.fileManager.open();
  };

  _handleFileSelect = file => {
    this.refs[this._ref].setValue(file);
    this._ref = null;
  };

  _renderInputGroup(index, label, name, initialValue = '') {
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
          name={name}
          value={initialValue}
          position={{ left: 10, height: 1, width: 16 }}>
        </Textbox>
      </box>
    );
  }

  _renderSSLInput(index, label, name) {
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
          ref={name}
          name={name}
          value=''
          position={{ left: 14, height: 1, width: 16 }}>
        </Textbox>
        <ThemedButton
          position={{ left: 30, height: 1, width: 4 }}
          onPress={() => this._openFileManager(name)}>
        </ThemedButton>
      </box>
    );
  }

  render() {
    const { theme } = this.props;
    const boxStyle = Object.assign({}, theme.box, theme.box.focus);

    return (
      <form
        keys
        ref='form'
        border='line'
        style={boxStyle}
        position={{ left: 1, right: 1, top: 0, bottom: 0 }}
        onSubmit={this._handleSubmit}>
        <FileManager
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
            {this._renderInputGroup(0, 'Name:', 'name', 'FIXME')}
            {this._renderInputGroup(1, 'Host:', 'host', '127.0.0.1')}
            {this._renderInputGroup(2, 'Port:', 'port', '6379')}
            {this._renderInputGroup(3, 'Password:', 'password')}
          </box>
        </box>
        <box
          label='SSL'
          border='line'        
          position={{ left: 36, top: 0, height: 14 }}
          style={theme.box}>
          <box position={{ left: 1, top: 1, height: 1, right: 1 }} style={theme.box}>
            {this._renderSSLInput(0, 'Private Key:', 'tlskey')}
            {this._renderSSLInput(1, 'Certificate:', 'tlscert')}
            {this._renderSSLInput(2, 'CA:', 'tlsca')}
          </box>
        </box>
        <box 
          border='line'
          position={{ left: 36, top: 14, height: 4 }}
          style={theme.box}>
          <box position={{ left: 1, top: 1, height: 1, right: 1 }} style={theme.box}>
            <ThemedButton
              position={{ height: 1, width: 16 }}
              content=' Connect '
              onPress={this.onConnectButtonClicked}>
            </ThemedButton>
          </box>
        </box>
      </form>
    );
  }
}

export default withTheme(ConfigForm);
