// @ts-check
import React, { useRef, useState, useEffect } from 'react';
import { Route, withRouter } from 'react-router';
import { withTheme } from '../contexts/theme-context';
import ConnectionForm from './connection-form';
import Database from './database';
import ConnectionList from './connection-list';
import MessageDialog from '../components/message-dialog';
import ActiveKeyboardBindings from './active-keyboard-bindings';
import connectToRedis from '../modules/redis/connect-to-redis';
import { useError } from '../hooks/error';

/**
 * @this {never}
 */
function RedisTerm({ history, theme }) {
  const redisTerm = useRef(null);
  const errorMessageDialog = useRef(null);
  const [redis, setRedis] = useState(null);
  const [isConnecting, setConnecting] = useState(false);
  const [editingConnection, setEditingConnection] = useState(null);

  const { message: errorMessage, clearError, showError } = useError();

  const formattedErrorMessage = errorMessage
    ? `{red-fg}{bold}${errorMessage}{/bold}{/red-fg}`
    : '';

  const editConnection = connection => {
    setEditingConnection(connection);
  };

  const doConnectToRedis = async options => {
    if (isConnecting) {
      return;
    }
    disconnectFromRedisIfNeeded();
    setConnecting(true);
    try {
      const redis = await connectToRedis(options);
      setRedis(redis);
    } finally {
      setConnecting(false);
    }
  };

  const disconnectFromRedisIfNeeded = () => {
    if (redis) {
      disconnectFromRedis();
    }
  };

  const disconnectFromRedis = () => {
    redis.disconnect();
    setRedis(null);
  };

  const onMessageDialogClosed = () => {
    clearError();
  };

  const goToPreviousViewIfPossible = () => {
    if (history.canGo(-1)) {
      goToPreviousView();
    }
  };

  const goToPreviousView = () => {
    history.goBack();
  };

  useEffect(() => {
    redisTerm.current.screen.key(['M-left', 'backspace'], () => {
      goToPreviousViewIfPossible();
    });

    process.on('unhandledRejection', showError);
    process.on('uncaughtException', showError);
  }, []);

  useEffect(() => {
    if (editingConnection) {
      history.push(`/connections/${editingConnection.id}/edit`)
    }
  }, [editingConnection, history]);

  useEffect(() => {
    if (errorMessage) {
      errorMessageDialog.current.open();
    }
  }, [errorMessage]);

  return (
    <box ref={redisTerm} position={{ top: 0, left: 0, bottom: 0, right: 0 }} style={theme.header}>
      <text style={theme.header} content="redis-term" />
      <box position={{ top: 1, left: 0, right: 0, bottom: 2 }} style={theme.main}>
        <Route
          path='/connections'
          component={props => <ConnectionList
            {...props}
            editConnection={editConnection}
            connectToRedis={doConnectToRedis}
          />}
        />
        <Route
          path='/connections/new'
          render={props => <ConnectionForm {...props} isNew={true} />} />
        <Route
          path='/connections/:id/edit'
          render={props => <ConnectionForm {...props} isNew={false} connection={editingConnection} />} />
        <Route
          path='/database'
          render={props => <Database {...props} redis={redis} />} />
      </box>
      <ActiveKeyboardBindings />
      <MessageDialog
        onHide={onMessageDialogClosed}
        position={{ left: 'center', top: 'center', width: '80%' }}
        title='{red-fg}Error{/red-fg}'
        ref={errorMessageDialog}
        text={formattedErrorMessage} />
    </box>
  );
}

export default withRouter(withTheme(RedisTerm));