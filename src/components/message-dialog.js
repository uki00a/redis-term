import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from './dialog';
import ThemedButton from './themed-button';
import { withTheme } from '../contexts/theme-context';

class MessageDialog extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    theme: PropTypes.object.isRequired,
    onClosed: PropTypes.func
  };

  state = { isOpened: false };

  open() {
    this.setState({ isOpened: true }, () => setImmediate(() => this.refs.okButton.focus()));
  }

  close = () => {
    this.setState({ isOpened: false });
    this.props.onClosed();
  };

  render() {
    const { text, position = {}, theme, ...restProps } = this.props;
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
          style={theme.box}
          position={{ top: boxOffset, height: lineHeight, left: 2, right: 2 }}
          content={text}
          tags
        />
        <ThemedButton
          ref='okButton'
          position={{ top: buttonOffset, height: 1, right: 2, width: 4 }}
          content='OK'
          align='center'
          onClick={this.close}
        />
      </Dialog>
    );
  }
}

export default withTheme(MessageDialog);
