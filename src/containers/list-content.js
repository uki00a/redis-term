import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ListContent from '../components/list-content';
import Loader from '../components/loader';
import { withRedis } from '../contexts/redis-context';

class ListContentContainer extends Component {
  static propTypes = {
    keyName: PropTypes.string.isRequired,
    redis: PropTypes.object.isRequired
  };

  state = { elements: [], isLoading: false };

  _addElementToList = async newElement => {
    if (!newElement) {
      return;
    }

    await this._addElementToDb(newElement);
    this._addElementToState(newElement);
  };

  _addElementToDb = async newElement => {
    const { keyName, redis } = this.props;

    await redis.lpush(keyName, newElement);
  };

  _addElementToState(newElement) {
    const newElements = [newElement].concat(this.state.elements);

    this.setState({ elements: newElements });
  }

  _save = async (newValue, index) => {
    await this._saveChangeToDb(index, newValue);
    this._saveChangeToState(index, newValue);
  };

  async _saveChangeToDb(index, newValue) {
    const { keyName, redis } = this.props;
    await redis.lset(keyName, index, newValue);
  }

  _saveChangeToState(index, newValue) {
    const newElements = this._updateElementAt(index, newValue);
    this.setState({ elements: newElements });
  }

  _updateElementAt(index, newValue) {
    return this.state.elements.map((x, i) => i === index
      ? newValue
      : x
    );
  }

  _loadList = async () => {
    this._showLoader();
    const { keyName, redis } = this.props;
    const elements = await redis.lrange(keyName, 0, -1);

    this.setState({ elements });
    this._hideLoader();
  };

  _showLoader() {
    this.setState({ isLoading: true });
  }

  _hideLoader() {
    this.setState({ isLoading: false });
  }

  async componentDidMount() {
    this._loadList();
  }

  render() {
    if (this.state.isLoading) {
      return <Loader />;
    } else {
      return (
        <ListContent
          keyName={this.props.keyName}
          elements={this.state.elements}
          addRow={this._addElementToList}
          save={this._save}
          reload={this._loadList}
        />
      );
    }
  }
}

export default withRedis(ListContentContainer);
