import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Textbox from './textbox';
import ThemedButton from './themed-button';
import Dialog from './dialog';
import { withTheme } from '../contexts/theme-context';

class AddHashFieldDialog extends Component {
  static propTypes = {
    onOk: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired
  };

  state = { isOpened: false };

  _onOk = () => {
    const key = this.refs.keyInput.value();
    const value = this.refs.valueInput.value();

    this.props.onOk(key, value);
    this.close();
  };

  _onCancel = () => this.close(() => this.props.onCancel());

  open() {
    this.setState({ isOpened: true });
  }

  close(callback) {
    this.setState({ isOpened: false }, () => {
      if (callback) setImmediate(callback);
    });
  }

  render() {
    const { title, theme, ...restProps } = this.props;

    return (
      <Dialog
        title={title}
        isOpened={this.state.isOpened}
        { ...restProps }>
        <text
          content='Key:'
          style={theme.box}
          position={{ top: 3, height: 1, left: 2, right: 2 }}
        />
        <Textbox
          style={theme.textbox}
          position={{ top: 4, height: 1, left: 2, right: 2 }}
          name='keyInput'
          bg='black'
          hoverBg='blue'
          ref='keyInput'
        />
        <text
          content='Value:'
          style={theme.box}
          position={{ top: 6, height: 1, left: 2, right: 2 }}
        />
        <Textbox
          style={theme.textbox}
          position={{ top: 7, height: 1, left: 2, right: 2 }}
          name='valueInput'
          bg='black'
          hoverBg='blue'
          ref='valueInput'
        />
        <ThemedButton
          position={{ top: 9, height: 1, left: 2, width: 6 }}
          content='OK'
          align='center'
          onClick={this._onOk}
        />
        <ThemedButton
          position={{ top: 9, height: 1, left: 10, width: 8 }}
          content='Cancel'
          align='center'
          onClick={this._onCancel}
        />
      </Dialog>
    );
  }
}

export default withTheme(AddHashFieldDialog);
