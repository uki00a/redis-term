import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withTheme } from '../contexts/theme-context';

const PROGRESS_TEXTS = ['|', '/', '/', '-', '\\'];

/**
 * @this {never}
 */
function Loader(props) {
  const loading = useRef(null);
  const [progressText, setProgressText] = useState('');

  useEffect(() => {
    let progressTextIndex = 0;
    const timer = setInterval(() => showProgressText(), 200);
    const showProgressText = () => {
      const progressText = PROGRESS_TEXTS[progressTextIndex % PROGRESS_TEXTS.length];
      setProgressText(`${progressText} ${props.text || 'loading...'}`);
      ++progressTextIndex;
    };

    showProgressText();

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <box
      name='loader'
      width='100%'
      height={2}
      ref={loading}
      style={props.theme.loader}
      {...props}
      content={progressText}>
    </box>
  );
}

Loader.propTypes = {
  text: PropTypes.string,
  theme: PropTypes.object.isRequired
};

export default withTheme(Loader);
