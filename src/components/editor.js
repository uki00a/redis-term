import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Editor extends Component {
  static propTypes = {
    defaultValue: PropTypes.string,
    disabled: PropTypes.bool
  };

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props.defaultValue) {
      // FIXME
      // Workaround for: `TypeError: Cannot read property 'height' of null`
      // `<textarea ... value={this.state.value} />`
      this.refs.textarea.setValue(this.props.defaultValue);
    }
  }

  componentDidMount() {
    // FIXME
    // Workaround for: `TypeError: Cannot read property 'height' of null`
    // `<textarea ... value={this.state.value} />`
    this.refs.textarea.setValue(this.props.defaultValue || '');
  }

  value() {
    return this.refs.textarea.value;
  }

  _onFocus = () => {
    if (this.props.disabled) {
      return;
    }

    // FIXME: Workaround for timing issue
    setImmediate(() => this.refs.textarea.readInput());
  };

  render() {
    const { defaultValue, ...restProps } = this.props;

    return (
      <textarea
        onFocus={this._onFocus}
        input
        keyable
        clickable
        keys
        mouse
        ref='textarea'
        border='line'
        { ...restProps }
      />
    );
  }
}

export default Editor;
