import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTheme } from '../contexts/theme-context';

class Dialog extends Component {
  static propTypes = {
    isOpened: PropTypes.bool.isRequired,
    theme: PropTypes.object.isRequired,
    title: PropTypes.string,
    children: PropTypes.node.isRequired
  };

  focus() {
    setImmediate(() => this.refs.dialog.focusNext());
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isOpened !== this.props.isOpened && this.props.isOpened) {
      this.focus();
    }
  }

  render() {
    const {
      isOpened,
      theme,
      title,
      children,
      ...restProps
    } = this.props;

    return (
      <form
        ref='dialog'
        hidden={!isOpened}
        style={theme.dialog}
        content={title}
        border='line'
        draggable
        keys
        keyable
        tags
        {...restProps}>
        {
          children
        }
      </form>
    );
  }

} 

export default withTheme(Dialog);
