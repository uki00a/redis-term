import { useState, useCallback } from 'react';
import { remove } from '../modules/utils';
import { DuplicateMemberError } from '../modules/errors';

export function useSet({ keyName, redis }) {
  const [members, setMembers] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [pattern, setPattern] = useState('');

  const loadMembers = useCallback(async pattern => {
    if (isLoading) {
      return;
    }
    setLoading(true);
    setPattern(pattern);
    try {
      const members = await getSetMembersStartWithPattern(redis, keyName, pattern);
      setMembers(members);
    } finally {
      setLoading(false);
    }
  }, [isLoading, keyName, redis]);

  const deleteMember = useCallback(async memberToDelete => {
    if (isSaving) {
      return;
    }
    setSaving(true);
    try {
      await redis.srem(keyName, memberToDelete);
      setMembers(remove(members, memberToDelete));
    } finally {
      setSaving(false);
    }
  }, [isSaving, members, keyName, redis]);

  const addMember = useCallback(async newMember => {
    if (isSaving) {
      return;
    }
    setSaving(true);
    try {
      await addMemberToSetIfNotExists(redis, keyName, newMember);
      setMembers(members.concat(newMember));
    } finally {
      setSaving(false);
    }
  }, [members, isSaving, keyName, redis]);

  return {
    members,
    isLoading,
    isSaving,
    pattern,
    loadMembers,
    deleteMember,
    addMember
  };
}

/**
 * @param {string} keyName 
 * @param {string} pattern 
 */
async function getSetMembersStartWithPattern(redis, keyName, pattern = '') {
  return getSetMembers(
    redis,
    keyName,
    pattern.endsWith('*') ? pattern : `${pattern}*`
  );
}

/**
 * @param {string} keyName 
 * @param {string} pattern 
 */
async function getSetMembers(redis, keyName, pattern = '*') {
  const cursor = 0;
  const count = 1000;
  const [_, members] = await redis.sscan( // eslint-disable-line no-unused-vars
    keyName,
    cursor,
    'MATCH',
    pattern,
    'COUNT',
    count
  );
  return members;
}

async function addMemberToSetIfNotExists(redis, keyName, newMember) {
  if (await redis.sismember(keyName, newMember)) {
    throw new DuplicateMemberError('set');
  } else {
    await redis.sadd(keyName, newMember);
  }
}
