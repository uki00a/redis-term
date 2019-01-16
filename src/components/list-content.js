import React, { Component } from 'react';
import Prompt from './prompt';
import PropTypes from 'prop-types';

class ListContent extends Component {
  static propTypes = {
    value: PropTypes.array.isRequired,
    theme: PropTypes.object.isRequired,
    addRow: PropTypes.func.isRequired
  };

  _openAddRowPrompt = () => {
    this.refs.addRowPrompt.open();
  };

  _renderAddRowPrompt() {
    return <Prompt
      ref='addRowPrompt'
      title='Add Row'
      theme={this.props.theme}
      onOk={value => {
        this.refs.addRowPrompt.close();
        this.props.addRow(value);
      }}
      onCancel={() => {
        this.refs.addRowPrompt.close();
      }}
     />;
  }

  _prepareTableData() {
    const { value } = this.props;
    const header = [['row', 'value']];
    const rows = value.map((value, i) => {
      const rownum = i + 1; 

      return [rownum, value];
    });

    return header.concat(rows);
  }

  render() {
    const data = this._prepareTableData();

    return (
      <form>
        <listtable
          position={{ width: '70%' }}
          data={data}
          border='line'
          alwaysScroll
          scrollbar
          scrollable
          clickable
          keys
          vi>
        </listtable>
        <box position={{ left: '70%' }}>
          <button
            clickable
            mouse
            position={{ height: 3 }}
            tags
            border='line'
            onClick={this._openAddRowPrompt}
            content='{center}Add Row{/center}' />
        </box>
        {
          this._renderAddRowPrompt()
        }
      </form>
    );
  }
}

export default ListContent;
