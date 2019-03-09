// @ts-check
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SetContent from '../components/set-content';
import Loader from '../components/loader';
import { operations } from '../modules/redux/set';

class SetContentContainer extends Component {
  static propTypes = {
    keyName: PropTypes.string.isRequired,
    members: PropTypes.array,
    isLoading: PropTypes.bool.isRequired,
    addMemberToSet: PropTypes.func.isRequired,
    updateSetMember: PropTypes.func.isRequired,
    deleteMemberFromSet: PropTypes.func.isRequired,
    filterSetMembers: PropTypes.func.isRequired
  };

  _addMember = async newMember => {
    if (!newMember) {
      return;
    }
    this.props.addMemberToSet(newMember);
  };

  _reload = () => {
    this.props.filterSetMembers(this.props.pattern);
  };

  async componentDidMount() {
    this.props.filterSetMembers();
  }

  render() {
    if (this.props.isLoading) {
      return <Loader />;
    } else {
      return (
        <SetContent
          keyName={this.props.keyName}
          members={this.props.members}
          addRow={this._addMember}
          reload={this._reload}
          filterMembers={this.props.filterSetMembers}
          saveMember={this.props.updateSetMember}
          removeRow={this.props.deleteMemberFromSet}
          lastPattern={this.props.pattern}
        />
      );
    }
  }
}

const mapStateToProps = ({ set }) => set;
const mapDispatchToProps = {
  addMemberToSet: operations.addMemberToSet,
  updateSetMember: operations.updateSetMember,
  deleteMemberFromSet: operations.deleteMemberFromSet,
  filterSetMembers: operations.filterSetMembers
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SetContentContainer);

