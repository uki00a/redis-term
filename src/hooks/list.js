import { useState, useCallback } from 'react';

export function useList({ redis, keyName }) {
  const [elements, setElements] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isSaving, setSaving] = useState(false);

  const loadElements = useCallback(async () => {
    if (isLoading) {
      return;
    }
    setLoading(false);
    try {
      const elements = await redis.lrange(keyName, 0, -1);
      setElements(elements);
    } finally {
      setLoading(false);
    }
  }, [keyName, redis, isLoading]);

  const addElementToList = useCallback(async newElement => {
    if (isSaving) {
      return;
    }
    setSaving(true);
    try {
      await redis.lpush(keyName, newElement);
      setElements([newElement].concat(elements));
    } finally {
      setSaving(false);
    }
  }, [elements, isSaving, keyName, redis]);

  const updateElement = useCallback(async (index, newValue) => {
    if (isSaving) {
      return;
    }
    setSaving(true);
    try {
      await redis.lset(keyName, index, newValue);
      setElements(elements.map((x, i) => i === index ? newValue : x));
    } finally {
      setSaving(false);
    }
  }, [elements, isSaving, keyName, redis]);

  return {
    elements,
    isLoading,
    isSaving,
    loadElements,
    addElementToList,
    updateElement
  };
}