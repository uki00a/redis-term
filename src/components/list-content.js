import React, { Component } from 'react';
import Prompt from './prompt';
import PropTypes from 'prop-types';

class ListContent extends Component {
  static propTypes = {
    value: PropTypes.array.isRequired,
    theme: PropTypes.object.isRequired
  };

  _openAddRowPrompt = () => {
    this.refs.addRowPrompt.open();
  };

  _openRemoveRowPrompt = () => {
    // TODO
  };

  _renderAddRowPrompt() {
    return <Prompt
      ref='addRowPrompt'
      title='Please input value:'
      theme={this.props.theme}
      onOk={(value)=>{
        // TODO
        this.refs.addRowPrompt.close();
      }}
      onCancel={()=>{
        // TODO
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
          border='line'>
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
          <button
            clickable
            mouse
            position={{ height: 3, top: 3 }}
            tags
            border='line'
            onClick={this._openRemoveRowPrompt}
            content='{center}Remove Row{/center}' />
        </box>
        {
          this._renderAddRowPrompt()
        }
      </form>
    );
  }
}

export default ListContent;
