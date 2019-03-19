// @ts-check
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ZsetContent from '../components/zset-content';
import Loader from '../components/loader';
import { operations } from '../modules/redux/zset';

class ZsetContentContainer extends Component {
  static propTypes = {
    keyName: PropTypes.string.isRequired,
    members: PropTypes.array.isRequired,
    scores: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
    pattern: PropTypes.string.isRequired,
    updateZsetMember: PropTypes.func.isRequired,
    addMemberToZset: PropTypes.func.isRequired,
    deleteMemberFromZset: PropTypes.func.isRequired,
    filterZsetMembers: PropTypes.func.isRequired
  };

  _loadZset = () => this.props.filterZsetMembers(this.props.pattern);

  async componentDidMount() {
    this._loadZset();
  }

  render() {
    if (this.props.isLoading) {
      return <Loader />;
    } else {
      return (
        <ZsetContent
          keyName={this.props.keyName}
          members={this.props.members}
          scores={this.props.scores}
          reload={this._loadZset}
          filterMembers={this.props.filterZsetMembers}
          addMember={this.props.addMemberToZset}
          removeMember={this.props.deleteMemberFromZset}
          saveMember={this.props.updateZsetMember}
          lastPattern={this.props.pattern}
        />
      );
    }
  }
}

const mapStateToProps = ({ zset }) => zset;
const mapDispatchToProps = {
  filterZsetMembers: operations.filterZsetMembers,
  updateZsetMember: operations.updateZsetMember,
  addMemberToZset: operations.addMemberToZset,
  deleteMemberFromZset: operations.deleteMemberFromZset
};

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(ZsetContentContainer);
