import React, { useRef, useImperativeHandle, useEffect, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { enableTabFocus, focusNext } from '../modules/blessed/helpers';

/**
 * @this {never}
 */
const Form = forwardRef((props, ref) => {
  const form = useRef(null);

  useImperativeHandle(ref, () => ({
    focusNext() {
      focusNext(form.current);
    },
    setFront() {
      form.current.setFront();
    },
    setIndex(index) {
      form.current.setIndex(index);
    },
    setBack() {
      form.current.setBack();
    },
    submit() {
      form.current.submit();
    },
    focus() {
      form.current.focus();
    }
  }))

  useEffect(() => {
    const disableTabFocus = enableTabFocus(form.current);
    return () => {
      disableTabFocus();
    };
  });

  return (
    <form
      ref={form}
      {...props}>
      {props.children}
    </form>
  );
});

Form.propTypes = {
  children: PropTypes.node.isRequired
};

export default Form;