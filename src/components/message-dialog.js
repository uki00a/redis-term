import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from './dialog';
import ThemedButton from './themed-button';
import { withTheme } from '../contexts/theme-context';

class MessageDialog extends Component {
  static propTypes = {
    text: PropTypes.string,
    theme: PropTypes.object.isRequired,
    onHide: PropTypes.func
  };

  state = { isOpened: false };

  open() {
    this.setState({ isOpened: true }, () => this.refs.okButton.focus());
  }

  close = () => {
    this.setState({ isOpened: false });
    this._handleMessageDialogHidden();
  };

  _onHide = () => {
    this.setState({ isOpened: false });
    this._handleMessageDialogHidden();
  };

  _handleMessageDialogHidden() {
    if (this.props.onHide) {
      this.props.onHide();
    }
  }

  render() {
    const { text, position = {}, theme, onHide, ...restProps } = this.props;
    const dialogPosition = { height: 'shrink', ...position };

    return (
      <Dialog
        isOpened={this.state.isOpened && Boolean(text)}
        position={dialogPosition}
        onHide={this._onHide}
        {...restProps}>
        <box
          style={theme.box}
          position={{ top: 2, left: 2, right: 2 }}
          content={text}
          tags
        />
        <ThemedButton
          ref='okButton'
          position={{ bottom: 1, height: 1, right: 2, width: 4 }}
          content='OK'
          align='center'
          onClick={this.close}
        />
      </Dialog>
    );
  }
}

export default withTheme(MessageDialog);
