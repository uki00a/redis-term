import React, { Component } from 'react';
import Prompt from './prompt';
import PropTypes from 'prop-types';
import Editor from './editor';
import List from './list';

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

  _editingMember() {
    return this.state.selectedMemberIndex == null
      ? null
      : this.props.members[this.state.selectedMemberIndex];
  }

  _editingScore() {
    return this.state.selectedMemberIndex == null
      ? null
      : this.props.scores[this.state.selectedMemberIndex];
  }

  _saveMember = () => {
    if (this.state.selectedMemberIndex == null) {
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
    const editingMember = this._editingMember();
    const editingScore = this._editingScore();
    const isNotEditing = this.state.selectedMemberIndex == null;

    return (
      <form>
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
        <box position={{ left: '50%', top: 1 }}>
          <Editor
            ref='scoreEditor'
            label='score'
            position={{ height: 5 }}
            defaultValue={editingScore}
            disabled={isNotEditing}
          />
          <Editor
            ref='valueEditor'
            label='value'
            position={{ top: 5, height: 30 }}
            defaultValue={editingMember}
            disabled={isNotEditing}
          />
          <button
            border='line'
            keys
            mouse
            content='{center}Save{/center}'
            tags
            position={{ top: 35, height: 3 }}
            onClick={this._saveMember}
          />
          <button
            clickable
            mouse
            position={{ top: 38, height: 3 }}
            tags
            border='line'
            onClick={this.props.reload}
            content='{center}Reload{/center}' />
        </box>
      </form>
    );
  }
}

export default ZsetContent;
