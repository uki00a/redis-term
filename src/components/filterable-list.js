import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Textbox from './textbox';
import { withTheme } from '../contexts/theme-context';

class FilterableList extends Component {
  static propTypes = {
    theme: PropTypes.object.isRequired,
    List: PropTypes.node.isRequired,
    filterList: PropTypes.func.isRequired,
    defaultPattern: PropTypes.string
  };

  _filterList = () => {
    const pattern = this.refs.patternInput.value();
    this.props.filterList(pattern);
  };

  render () {
    const { List, defaultPattern, theme, ...restProps } = this.props;
    return (
      <box {...restProps}>
        <box position={{ bottom: 3 }}>
          { List }
        </box>
        <Textbox
          style={theme.patternInput}
          ref='patternInput'
          label='Search'
          onSubmit={this._filterList}
          border='line'
          position={{bottom: 0, height: 3, width: '100%'}}
          defaultValue={defaultPattern} />
      </box>
    );
  }
}

export default withTheme(FilterableList);
