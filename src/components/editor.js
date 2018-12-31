import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Editor extends Component {
  static propTypes = {
    defaultValue: PropTypes.string
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

  render() {
    return (
      <textarea
        inputOnFocus
        input
        keyable
        clickable
        keys
        mouse
        ref='textarea'
        border='line'
      />
    );
  }
}

export default Editor;
