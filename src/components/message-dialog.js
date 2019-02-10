import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from './dialog';

class MessageDialog extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired
  };

  state = { isOpened: false };

  open() {
    this.setState({ isOpened: true });
  }

  close = () => {
    this.setState({ isOpened: false });
  };

  render() {
    const { text, ...restProps } = this.props;
    return (
      <Dialog
        isOpened={this.state.isOpened}
        {...restProps}>
        <box
          position={{ top: 2, height: 1, left: 2, right: 2 }}
          content={text}
          tags
        />
        <button
          position={{ top: 4, height: 1, right: 2, width: 4 }}
          content='OK'
          align='center'
          mouse
          clickable
          onClick={this.close}
        />
      </Dialog>
    );
  }
}

export default MessageDialog;
