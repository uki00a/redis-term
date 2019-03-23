import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTheme } from '../contexts/theme-context';

class FileManager extends Component {
  static propTypes = {
    theme: PropTypes.object.isRequired,
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
    this.setState({ isOpened: false }, () => {
      this.refs.fileManager.setBack(); 

      // FIXME Workaround for onHide does not work
      if (this.props.onHide) {
        this.props.onHide();
      }
    });
  }

  _prepareFileManager() {
    this.refs.fileManager.refresh(() => {
      this.refs.fileManager.setFront();
      this.refs.fileManager.focus();
    });
  }

  componentDidMount() {
    this.refs.fileManager.on('keypress', (ch, key) => {
      if (key.full === 'escape') {
        this.close();
      }
      return false;
    });
  }

  render() {
    return (
      <filemanager
        border='line'
        style={this.props.theme.box}
        { ...this.props }
        keys
        clickable
        keyable
        mouse
        vi
        onFile={this._onFile}
        hidden={!this.state.isOpened}
        ref='fileManager' 
      />
    );
  }
}

export default withTheme(FileManager);
