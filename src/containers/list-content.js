// @ts-check
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ListContent from '../components/list-content';
import Loader from '../components/loader';
import { operations } from '../modules/redux/list';

class ListContentContainer extends Component {
  static propTypes = {
    keyName: PropTypes.string.isRequired,
    elements: PropTypes.array,
    isLoading: PropTypes.bool.isRequired,
    addElementToList: PropTypes.func.isRequired,
    loadListElements: PropTypes.func.isRequired,
    updateListElement: PropTypes.func.isRequired
  };

  async componentDidMount() {
    this.props.loadListElements();
  }

  render() {
    if (this.props.isLoading) {
      return <Loader />;
    } else {
      return (
        <ListContent
          keyName={this.props.keyName}
          elements={this.props.elements}
          addElement={this.props.addElementToList}
          save={this.props.updateListElement}
          reload={this.props.loadListElements}
        />
      );
    }
  }
}

const mapStateToProps = state => state.list;
const mapDispatchToProps = {
  loadListElements: operations.loadListElements,
  addElementToList: operations.addElementToList,
  updateListElement: operations.updateListElement
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListContentContainer);
