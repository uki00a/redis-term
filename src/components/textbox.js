import React, { Component } from 'react';

class Textbox extends Component {
  // FIXME: Workaround for TypeError when inputOnFocus is set.
  // `TypeError: done is not a function`
  _onFocus = () => setImmediate(() => this.refs.textbox.readInput())
  ;

  value() {
    return this.refs.textbox.value;
  }

  render() {
    // FIXME
    const { onFocus, ref, ...props } = this.props;

    return (
      <textbox
        keyable
        clickable
        keys
        mouse
        onFocus={this._onFocus}
        ref='textbox'
        { ....props }
      />
    );
  }
}

export default Textbox;
