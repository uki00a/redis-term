import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Textbox from './textbox';

class FilterableList extends Component {
  static propTypes = {
    List: PropTypes.node.isRequired,
    filterList: PropTypes.func.isRequired,
    defaultPattern: PropTypes.string
  };

  _filterList = () => {
    const pattern = this.refs.patternInput.value();
    this.props.filterList(pattern);
  };

  render () {
    const { List, defaultPattern, ...restProps } = this.props;
    return (
      <box {...restProps}>
        <box position={{ bottom: 3 }}>
          { List }
        </box>
        <Textbox
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

export default FilterableList;