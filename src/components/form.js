import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { enableTabFocus } from '../modules/utils/blessed';

class Form extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  };

  focusNext() {
    focusNextOf(this.refs.form);
  }

  setFront() {
    this.refs.form.setFront();
  }

  setIndex(index) {
    this.refs.form.setIndex(index);
  }

  setBack() {
    this.refs.form.setBack();
  }

  submit() {
    this.refs.form.submit();
  }

  focus() {
    this.refs.form.focus();
  }

  componentDidMount() {
    this._listenToKeypress();
  }

  componentWillUnmount() {
    this._disableTabFocus();
  }

  _listenToKeypress() {
    this._disableTabFocus = enableTabFocus(this.refs.form);
  }

  render() {
    return (
      <form
        ref='form'
        {...this.props}>
        {this.props.children}
      </form>
    );
  }
}

export default Form;