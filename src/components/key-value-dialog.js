import React, { Component } from 'react';
import PropTypes from 'prop-types';

class KeyValueDialog extends Component {
  static propTypes = {
    theme: PropTypes.object.isRequired,
    onOk: PropTypes.func.isRequired,
    onCancel: PropTypes.func
  };

  state = { isOpened: false };

  _onOk = () => {
    const key = this.refs.keyInput.value;
    const value = this.refs.valueInput.value;

    this.props.onOk({ key, value });
    this.close();
  };

  _onCancel = () => this.close();

  open() {
    this.setState({ isOpened: true });
  }

  close() {
    this.setState({ isOpened: false });
  }

  _onFocus(ref) {
    // FIXME: Workaround for TypeError when inputOnFocus is set.
    // `TypeError: done is not a function`
    return () => setImmediate(() => this.refs[ref].readInput());
  }

  render() {
    return (
      <box
        content={this.props.title}
        style={this.props.theme.prompt}
        border='line'
        hidden={!this.state.isOpened}>
        <text
          content='Key:'
          position={{ top: 3, height: 1, left: 2, right: 2 }}
        />
        <textarea
          position={{ top: 4, height: 1, left: 2, right: 2 }}
          name='keyInput'
          keyable
          clickable
          keys
          mouse
          bg='black'
          hoverBg='blue'
          ref='keyInput'
          onFocus={this._onFocus('keyInput')}
        />
        <text
          content='Value:'
          position={{ top: 6, height: 1, left: 2, right: 2 }}
        />
        <textarea
          position={{ top: 7, height: 1, left: 2, right: 2 }}
          name='valueInput'
          keyable
          clickable
          keys
          mouse
          bg='black'
          hoverBg='blue'
          ref='valueInput'
          onFocus={this._onFocus('valueInput')}
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
      </box>
    );
  }
}

export default KeyValueDialog;
