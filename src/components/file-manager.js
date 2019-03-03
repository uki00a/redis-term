import React, { Component } from 'react';
import PropTypes from 'prop-types';

class FileManager extends Component {
  static propTypes = {
    cwd: PropTypes.string,
    onFile: PropTypes.func.isRequired
  };

  state = { isOpened: false };

  _onFile = file => {
    this.props.onFile(file);
    this.close();
  };

  open() {
    this.setState({ isOpened: true }, () => this._prepareFileManager());
  }

  close() {
    this.setState({ isOpened: false });
  }

  _prepareFileManager() {
    this.refs.fileManager.focus();
    this.refs.fileManager.setFront();
    this.refs.fileManager.refresh();
  }

  render() {
    return (
      <filemanager
        position={{ width: '100%', height: '100%' }}
        style={{
          fg: 'white', 
          bg: 'black'
        }}
        { ...this.props }
        keys
        clickable
        mouse
        vi
        onFile={this._onFile}
        hidden={!this.state.isOpened}
        ref='fileManager' 
      />
    );
  }
}

export default FileManager;
