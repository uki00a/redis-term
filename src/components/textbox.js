import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Textbox extends Component {
  static propTypes = { 
    defaultValue: PropTypes.string
  };
  // FIXME: Workaround for TypeError when inputOnFocus is set.
  // `TypeError: done is not a function`
  _onFocus = () => setImmediate(() => this.refs.textbox.readInput())
  ;

  // TODO remove duplicate logic between <Textbox> and <Editor>
  componentDidUpdate(prevProps) {
    if (prevProps.defaultValue !== this.props.defaultValue) {
      // FIXME
      // Workaround for: `TypeError: Cannot read property 'height' of null`
      // `<textarea ... value={this.state.value} />`
      this.refs.textbox.setValue(this.props.defaultValue);
    }
  }

  // TODO remove duplicate logic between <Textbox> and <Editor>
  componentDidMount() {
    if (this.props.defaultValue) {
      // FIXME
      // Workaround for: `TypeError: Cannot read property 'height' of null`
      // `<textarea ... value={this.state.value} />`
      this.refs.textbox.setValue(this.props.defaultValue);
    }
  }

  focus() {
    this.refs.textbox.focus();
  }

  setValue(value) {
    this.refs.textbox.setValue(value);
  }

  value() {
    return this.refs.textbox.value;
  }

  render() {
    // FIXME
    const { onFocus, ...props } = this.props;

    return (
      <textbox
        keyable
        clickable
        keys
        mouse
        onFocus={this._onFocus}
        ref='textbox'
        { ...props }
      />
    );
  }
}

export default Textbox;
