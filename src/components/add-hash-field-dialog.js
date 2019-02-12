import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Textbox from './textbox';
import Dialog from './dialog';

class KeyValueDialog extends Component {
  static propTypes = {
    onOk: PropTypes.func.isRequired,
    onCancel: PropTypes.func
  };

  state = { isOpened: false };

  _onOk = () => {
    const key = this.refs.keyInput.value();
    const value = this.refs.valueInput.value();

    this.props.onOk(key, value);
    this.close();
  };

  _onCancel = () => this.close();

  open() {
    this.setState({ isOpened: true });
  }

  close() {
    this.setState({ isOpened: false });
  }

  render() {
    return (
      <Dialog
        title={this.props.title}
        isOpened={this.state.isOpened}>
        <text
          content='Key:'
          position={{ top: 3, height: 1, left: 2, right: 2 }}
        />
        <Textbox
          position={{ top: 4, height: 1, left: 2, right: 2 }}
          name='keyInput'
          bg='black'
          hoverBg='blue'
          ref='keyInput'
        />
        <text
          content='Value:'
          position={{ top: 6, height: 1, left: 2, right: 2 }}
        />
        <Textbox
          position={{ top: 7, height: 1, left: 2, right: 2 }}
          name='valueInput'
          bg='black'
          hoverBg='blue'
          ref='valueInput'
        />
        <button
          position={{ top: 9, height: 1, left: 2, width: 6 }}
          content='OK'
          align='center'
          bg='black'
          hoverBg='blue'
          mouse
          clickable
          onClick={this._onOk}
        />
        <button
          position={{ top: 9, height: 1, left: 10, width: 8 }}
          shrink
          content='Cancel'
          align='center'
          bg='black'
          hoverBg='blue'
          mouse
          clickable
          onClick={this._onCancel}
        />
      </Dialog>
    );
  }
}

export default KeyValueDialog;