import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTheme } from '../contexts/theme-context';
import Form from './form';

class Dialog extends Component {
  static propTypes = {
    isOpened: PropTypes.bool.isRequired,
    theme: PropTypes.object.isRequired,
    title: PropTypes.string,
    children: PropTypes.node.isRequired
  };

  focus() {
    this.refs.dialog.focusNext();
  }

  componentDidUpdate(prevProps) {
    if (this.props.isOpened) {
      this.refs.dialog.setFront();
      this.refs.dialog.setIndex(2000);
      this.focus();
    } else {
      this.refs.dialog.setBack();
    }
  }

  _handleKeypress = (ch, key) => {
    if (key.full === 'escape') {
      this.refs.dialog.hide();
    }
  };

  render() {
    const {
      isOpened,
      theme,
      title,
      children,
      ...restProps
    } = this.props;

    return (
      <Form
        onKeypress={this._handleKeypress}
        ref='dialog'
        hidden={!isOpened}
        style={theme.dialog}
        content={title}
        border='line'
        tags
        {...restProps}>
        {
          children
        }
      </Form>
    );
  }

} 

export default withTheme(Dialog);
