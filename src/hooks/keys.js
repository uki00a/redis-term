// @ts-check
import { useState, useCallback } from 'react';
import { DuplicateKeyError } from '../modules/errors';

const DEFAULT_SCORE = 0;

export function useKeys({ redis }) {
  const [keys, setKeys] = useState([]);
  const [pattern, setPattern] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [selected, setSelected] = useState({});

  const getKeys = useCallback(async (pattern = '*') => {
    if (isLoading) {
      return;
    }
    setLoading(true);
    setPattern(pattern);
    try {
      const keys = await getKeysStartWith(redis, pattern);
      setKeys(keys);
    } finally {
      setLoading(false);
    }
  }, [isLoading, redis]);

  const selectKey = useCallback(async key => {
    if (isLoading) {
      return;
    }
    setLoading(true);
    try {
      const type = await redis.type(key)
      setSelected({ keyName: key, type });
    } finally {
      setLoading(false);
    }
  }, [isLoading, redis]);

  const unselectKey = () => {
    setSelected({});
  };

  const addNewKey = useCallback(async (keyName, type) => {
    if (isSaving) {
      return;
    }
    setSaving(true);
    try {
      await addNewKeyIfNotExists(redis, keyName, type);
      if (keys.indexOf(keyName) === -1) {
        setKeys(keys.concat(keyName));
      }
    } finally {
      setSaving(false);
    }
  }, [keys, isSaving, redis]);

  const deleteKey = useCallback(async key => {
    if (isSaving) {
      return;
    }
    setSaving(true);
    try {
      await redis.del(key);
      setKeys(keys.filter(x => x !== key))
    } finally {
      setSaving(false);
    }
  }, [isSaving, keys, redis]);

  return {
    keys,
    pattern,
    isLoading,
    isSaving,
    selected,
    getKeys,
    selectKey,
    unselectKey,
    addNewKey,
    deleteKey
  };
}

async function getKeysStartWith(redis, pattern = '*') {
  return await getKeys(redis, pattern.endsWith('*') ? pattern : `${pattern}*`);
}

async function getKeys(redis, pattern = '*') {
  const cursor = 0;
  const count = 1000;
  const [_, keys] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', count); // eslint-disable-line no-unused-vars
  return keys;
}

async function addNewKeyIfNotExists(redis, keyName, type) {
  const keyExists = await redis.exists(keyName);
  if (!keyExists) {
    await addNewKey(redis, keyName, type);
  } else {
    throw new DuplicateKeyError(keyName);
  }
}

/**
 * @param {string} keyName 
 */
function addNewKey(redis, keyName, type) {
  switch (type) {
  case 'string':
    return redis.set(keyName, 'New String');
  case 'list':
    return redis.lpush(keyName, 'New Element');
  case 'hash':
    return redis.hset(keyName, 'New Key', 'New Value');
  case 'set':
    return redis.sadd(keyName, 'New Member');
  case 'zset':
    return redis.zadd(keyName, DEFAULT_SCORE, 'New Member');
  }
}