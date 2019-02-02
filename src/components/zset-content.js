import React, { Component } from 'react';
import Prompt from './prompt';
import PropTypes from 'prop-types';
import Editor from './editor';
import List from './list';
import ScrollableBox from './scrollable-box';

class ZsetContent extends Component {
  static propTypes = {
    keyName: PropTypes.string.isRequired,
    members: PropTypes.array.isRequired,
    scores: PropTypes.array.isRequired,
    theme: PropTypes.object.isRequired,
    reload: PropTypes.func.isRequired,
    saveMember: PropTypes.func.isRequired
  };

  state = { selectedMemberIndex: null };

  _hasSelectedMember() {
    return this.state.selectedMemberIndex != null;
  }

  _editingMember() {
    return this._hasSelectedMember()
      ? this.props.members[this.state.selectedMemberIndex]
      : null;
  }

  _editingScore() {
    return this._hasSelectedMember()
      ? this.props.scores[this.state.selectedMemberIndex]
      : null;
  }

  _saveMember = () => {
    if (!this._hasSelectedMember()) {
      return;
    }

    const oldValue = this.props.members[this.state.selectedMemberIndex];
    const newValue = this.refs.valueEditor.value();
    const newScore = this.refs.scoreEditor.value();

    this.props.saveMember(oldValue, newValue, newScore);
  };

  _onMemberSelected = (item, index) => {
    this.setState({ selectedMemberIndex: index });
  };

  render() {
    const hasSelectedMember = this._hasSelectedMember();
    const editingMember = this._editingMember();
    const editingScore = this._editingScore();

    return (
      <box>
        <box
          content={this.props.keyName}
          position={{ width: '100%', height: 1 }}
          bold
        />
        <List
          items={this.props.members}
          position={{ width: '50%', top: 1 }}
          style={this.props.theme.list}
          onSelect={this._onMemberSelected}
        />
        <ScrollableBox position={{ left: '50%', top: 1, height: '90%' }}>
          <Editor
            ref='scoreEditor'
            label='score'
            position={{ height: 5, width: '95%' }}
            defaultValue={editingScore}
            disabled={!hasSelectedMember}
          />
          <Editor
            ref='valueEditor'
            label='value'
            position={{ top: 5, height: 30, width: '95%' }}
            defaultValue={editingMember}
            disabled={!hasSelectedMember}
          />
          <button
            border='line'
            keys
            mouse
            content='{center}Save{/center}'
            tags
            position={{ top: 35, height: 3, width: '95%' }}
            onClick={this._saveMember}
          />
          <button
            clickable
            mouse
            position={{ top: 38, height: 3, width: '95%' }}
            tags
            border='line'
            onClick={this.props.reload}
            content='{center}Reload{/center}' />
        </ScrollableBox>
      </box>
    );
  }
}

export default ZsetContent;
