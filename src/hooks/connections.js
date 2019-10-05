// @ts-check
import { useState, useCallback } from 'react';
import * as api from '../modules/connections';

/**
 * @this {never}
 */
export function useConnections() {
  const [connections, setConnections] = useState([]);
  const [isSaving, setSaving] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const loadConnections = useCallback(async () => {
    if (isLoading) {
      return;
    }
    setLoading(true);
    try {
      const connections = await api.loadConnections();
      setConnections(connections);
    } finally {
      setLoading(false);
    }
  }, [isLoading]);

  const loadConnectionsIfNotLoaded = useCallback(async () => {
    if (connections.length === 0) {
      return loadConnections(); 
    }
  }, [loadConnections, connections]);

  const addConnection = useCallback(async connection => {
    if (isSaving) {
      return;
    }
    setSaving(true);
    try {
      const id = await api.addConnection(connection);
      setConnections(connections.concat({ ...connection, id }));
    } finally {
      setSaving(false);
    }
  }, [isSaving, connections]);

  const updateConnection = useCallback(async connection => {
    if (isSaving) {
      return;
    }
    setSaving(true);
    try {
      await api.updateConnection(connection);
      const connectionIndex = connections.findIndex(x => x.id === connection.id);
      const newList = connections.map((x, index) => index === connectionIndex ? connection : x);
      setConnections(newList);
    } finally {
      setSaving(false);
    }
  }, [isSaving, connections]);

  const deleteConnection = useCallback(async connection => {
    if (isSaving) {
      return;
    }
    setSaving(true);
    try {
      await api.deleteConnection(connection);
      const connectionIndex = connections.findIndex(x => x.id === connection.id);
      setConnections(connections.filter((x, index) => index !== connectionIndex));
    } finally {
      setSaving(false);
    }
  }, [isSaving, connections]);

  return {
    connections,
    isSaving,
    isLoading,
    loadConnections,
    loadConnectionsIfNotLoaded,
    addConnection,
    updateConnection,
    deleteConnection
  };
}
