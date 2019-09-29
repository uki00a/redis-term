import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import Textbox from './textbox';
import { withTheme } from '../contexts/theme-context';

/**
 * @this {never}
 */
function FilterableList({
  List,
  defaultPattern,
  theme,
  filterList,
  ...restProps
}) { 
  const patternInput = useRef(null);

  const handleSubmit = () => {
    const pattern = patternInput.current.value();
    filterList(pattern);
  };

  return (
   <box {...restProps}>
     <box position={{ bottom: 3 }}>
       { List }
     </box>
     <Textbox
       style={theme.patternInput}
       ref={patternInput}
       label='Search'
       onSubmit={handleSubmit}
       border='line'
       position={{bottom: 0, height: 3, width: '100%'}}
       defaultValue={defaultPattern} />
   </box>
  ); 
}

FilterableList.propTypes = {
  theme: PropTypes.object.isRequired,
  List: PropTypes.node.isRequired,
  filterList: PropTypes.func.isRequired,
  defaultPattern: PropTypes.string
};

export default withTheme(FilterableList);
