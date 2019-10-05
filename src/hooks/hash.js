import { useState, useCallback } from 'react';
import { plistToHash } from '../modules/utils';
import { DuplicateFieldError } from '../modules/errors';

export function useHash({ keyName, redis }) {
  const [hash, setHash] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [pattern, setPattern] = useState('');

  const loadHash = useCallback(async pattern => {
     if (isLoading) {
      return;
    }
    setLoading(true);
    setPattern(pattern);
    try {
      const hash = await getHashFieldsStartWithPattern(redis, keyName, pattern);
      setHash(hash);
    } finally {
      setLoading(false);
    } 
  }, [isLoading, keyName, redis])

  const addFieldToHash = useCallback(async (field, value) => {
    if (isSaving) {
      return;
    }
    setSaving(true);
    try {
      await addFieldToHashIfNotExists(redis, keyName, field, value);
      setHash({ ...hash, [field]: value });
    } finally {
      setSaving(false);
    }
  }, [hash, isSaving, keyName, redis]);

  const setField = useCallback(async (field, newValue) => {
    if (isSaving) {
      return;
    }

    setSaving(true);
    try {
      await redis.hset(keyName, field, newValue);
      setHash({ ...hash, [field]: newValue });
    } finally {
      setSaving(false);
    }
  }, [isSaving, hash, keyName, redis]);

  const deleteField = useCallback(async fieldToDelete => {
    if (isSaving) {
      return;
    }
    setSaving(true);
    try {
      await redis.hdel(keyName, fieldToDelete);
      const newHash = { ...hash };
      delete newHash[fieldToDelete];
      setHash(newHash);
    } finally {
      setSaving(false);
    }
  })

  return {
    hash,
    isLoading,
    isSaving,
    pattern,
    loadHash,
    addFieldToHash,
    setField,
    deleteField
  };
}

async function getHashFieldsStartWithPattern(redis, keyName, pattern = '*') {
  return getHashFields(
    redis,
    keyName,
    pattern.endsWith('*') ? pattern : `${pattern}*`
  );
}

async function getHashFields(redis, keyName, pattern = '*') {
  const cursor = 0;
  const count = 1000;
  const [_, result] = await redis.hscan( // eslint-disable-line no-unused-vars
    keyName, 
    cursor,
    'MATCH',
    pattern.endsWith('*') ? pattern : `${pattern}*`,
    'COUNT',
    count
  );
  return plistToHash(result);
}

/**
 * @param {string} keyName 
 * @param {string} fieldName 
 * @param {string} value 
 */
async function addFieldToHashIfNotExists(redis, keyName, fieldName, value) {
  if (await (fieldExistsInHash(redis, keyName, fieldName))) {
    throw new DuplicateFieldError();
  } else {
    return await redis.hset(keyName, fieldName, value);
  }
}

/**
 * @param {string} keyName 
 * @param {string} fieldName 
 * @returns {Promise<boolean>}
 */
function fieldExistsInHash(redis, keyName, fieldName) {
  return redis.hexists(keyName, fieldName);
}