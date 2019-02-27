import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from './dialog';
import ThemedButton from './themed-button';

class ConfirmationDialog extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    onOk: PropTypes.func.isRequired
  };

  state = { isOpened: false };

  _onOk = () => {
    this.props.onOk();
    this.close();
  };

  open() {
    this.setState({ isOpened: true });
  }

  close = () => {
    this.setState({ isOpened: false });
  };

  render() {
    const { text, position = {}, ...restProps } = this.props;
    const lineHeight = text.split('\n').length + 1;
    const boxOffset = 2;
    const buttonOffset = lineHeight + boxOffset;
    const dialogHeight = buttonOffset * 2;
    const dialogPosition = { height: dialogHeight, ...position };

    return (
      <Dialog
        isOpened={this.state.isOpened}
        position={dialogPosition}
        {...restProps}>
        <box
          position={{ top: boxOffset, height: lineHeight, left: 2, right: 2 }}
          content={text}
          tags
        />
        <ThemedButton
          position={{ top: buttonOffset, height: 1, left: 2, width: 6 }}
          content='OK'
          align='center'
          onClick={this._onOk}
        />
        <ThemedButton
          position={{ top: buttonOffset, height: 1, left: 10, width: 8 }}
          content='Cancel'
          align='center'
          onClick={this.close}
        />
      </Dialog>
    );
  }
}

export default ConfirmationDialog;
