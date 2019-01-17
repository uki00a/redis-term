import React, { Component } from 'react';
import Prompt from './prompt';
import PropTypes from 'prop-types';
import Table from './table';

class ListContent extends Component {
  static propTypes = {
    keyName: PropTypes.string.isRequired,
    value: PropTypes.array.isRequired,
    theme: PropTypes.object.isRequired,
    addRow: PropTypes.func.isRequired,
    reload: PropTypes.func.isRequired
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
        <box
          content={this.props.keyName}
          position={{ width: '100%', height: 1 }}
          bold
        />
        <Table
          data={data}
          position={{ width: '70%', top: 1 }}
        />
        <box position={{ left: '70%', top: 1 }}>
          <button
            clickable
            mouse
            position={{ height: 3 }}
            tags
            border='line'
            onClick={this._openAddRowPrompt}
            content='{center}Add Row{/center}' />
          <button
            clickable
            mouse
            position={{ height: 3, top: 3 }}
            tags
            border='line'
            onClick={this.props.reload}
            content='{center}Reload{/center}' />
        </box>
        {
          this._renderAddRowPrompt()
        }
      </form>
    );
  }
}

export default ListContent;
