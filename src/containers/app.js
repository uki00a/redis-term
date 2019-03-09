import React, { Component } from 'react';
import { MemoryRouter } from 'react-router';
import { Provider as StoreProvider } from 'react-redux';
import PropTypes from 'prop-types';
import RedisTerm from './redis-term';
import { ThemeProvider } from '../contexts/theme-context';
import configureStore from '../modules/redux/store';

const store = configureStore();

class App extends Component {
  static propTypes = {
    screen: PropTypes.object.isRequired
  };

  state = { error: null };

  _handleError = error => {
    this.props.screen.debug(error);
    this.setState({ error });
  };

  componentDidCatch(err, info) { 
    this._handleError(err);
  }

  componentDidMount() {
    process.on('unhandledRejection', this._handleError);
  }

  componentWillUnmount() {
    process.removeListener('unhandledRejection', this._handleError);
  }

  render() {
    return (
      <StoreProvider store={store}>
        <ThemeProvider>
          <MemoryRouter initialEntries={['/connection']}>
            <RedisTerm
              error={this.state.error}
            />
          </MemoryRouter>
        </ThemeProvider>
      </StoreProvider>
    );
  }
}

export default App;