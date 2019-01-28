import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ListContent from '../components/list-content';
import { withRedis } from '../contexts/redis-context';
import theme from '../theme';

class ListContentContainer extends Component {
  static propTypes = {
    keyName: PropTypes.string.isRequired,
    redis: PropTypes.object.isRequired
  };

  state = { elements: [] };

  _addRow = async newElement => {
    if (!newElement) {
      return;
    }

    const { keyName, redis } = this.props;

    await redis.lpush(keyName, newElement);
    this._addElement(newElement);
  };

  _save = async (newValue, index) => {
    const { keyName, redis } = this.props;

    await redis.lset(keyName, index, newValue);
    const newElements = this.state.elements.map((x, i) => i === index
      ? newValue
      : x
    );
    this.setState({ elements: newElements });
  };

  _loadList = async () => {
    // TODO show loader
    const { keyName, redis } = this.props;
    const elements = await redis.lrange(keyName, 0, -1);

    this.setState({ elements });
  };

  _addElement(newElement) {
    const newElements = [newElement].concat(this.state.elements);

    this.setState({ elements: newElements });
  }

  async componentDidMount() {
    this._loadList();
  }

  render() {
    return (
      <ListContent
        keyName={this.props.keyName}
        elements={this.state.elements}
        theme={theme}
        addRow={this._addRow}
        save={this._save}
        reload={this._loadList}
      />
    );
  }
}

export default withRedis(ListContentContainer);
