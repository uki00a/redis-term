import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Textbox from './textbox';
import Dialog from './dialog';
import ThemedButton from './themed-button';
import { withTheme } from '../contexts/theme-context';

class AddZsetMemberDialog extends Component {
  static propTypes = {
    onOk: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    theme: PropTypes.object.isRequired
  };
  state = { isOpened: false };

  _onOk = () => {
    const score = this.refs.scoreInput.value();
    const value = this.refs.valueInput.value();
    this.props.onOk(score, value);
    this.close();
  };

  _onCancel = () => this.close();

  open() {
    this.setState({ isOpened: true });
    this.refs.scoreInput.focus();
  }

  close() {
    this.setState({ isOpened: false });
  }

  render() {
    const { title, theme, ...restProps } = this.props;

    return (
      <Dialog
        title={title}
        isOpened={this.state.isOpened}
        { ...restProps }>
        <text
          content='Score:'
          style={theme.box}
          position={{ top: 3, height: 1, left: 2, right: 2 }}
        />
        <Textbox
          position={{ top: 4, height: 1, left: 2, right: 2 }}
          name='scoreInput'
          bg='black'
          hoverBg='blue'
          ref='scoreInput'
        />
        <text
          content='Value:'
          style={theme.box}
          position={{ top: 6, height: 1, left: 2, right: 2 }}
        />
        <Textbox
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

export default withTheme(AddZsetMemberDialog);
