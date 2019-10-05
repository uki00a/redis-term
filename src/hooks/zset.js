import { useState, useCallback } from 'react'
import { DuplicateMemberError } from '../modules/errors';
import { partitionByParity } from '../modules/utils';

export function useZset({ redis, keyName }) {
  const [members, setMembers] = useState([]);
  const [scores, setScores] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [pattern, setPattern] = useState('');

  const loadMembersAndScores = useCallback(async pattern => {
    if (isLoading) {
      return;
    }
    setLoading(true);
    setPattern(pattern);
    try {
      const [members, scores] = await getZsetMembersStartWithPattern(redis, keyName, pattern);
      setMembers(members);
      setScores(scores);
    } finally {
      setLoading(false);
    }
  }, [isLoading, keyName, redis]);

  const addMemberAndScore = useCallback(async (newMember, score) => {
    if (isSaving) {
      return;
    }
    setSaving(true);
    try {
      await addMemberToZsetIfNotExists(redis, keyName, newMember, score);
      {
        const newValueIndex = members.indexOf(newMember);
        if (newValueIndex === -1) {
          setMembers([newMember].concat(members));          
          setScores([score].concat(scores));
        } else {
          setScores(scores.map((x, index) => index === newValueIndex
            ? score
            : x));
        }
      }
    } finally {
      setSaving(false);
    }
  }, [isSaving, members, scores, keyName, redis]);

  const updateScore = useCallback(async (member, newScore) => {
    if (isSaving) {
      return;
    }
    setSaving(true);
    try {
      await updateZsetMember(redis, keyName, member, newScore);
      const indexToUpdate = members.indexOf(member);
      setScores(scores.map((x, index) => index === indexToUpdate ? newScore : x));
    } finally {
      setSaving(false);
    }
  }, [isSaving, scores, members, keyName, redis]);

  const deleteMember = useCallback(async memberToDelete => {
    if (isSaving) {
      return;
    }
    setSaving(true);
    try {
      await deleteMemberFromZset(redis, keyName, memberToDelete);
      const index = members.indexOf(memberToDelete);
      if (index > -1) {
        const newMembers = members.slice(0);
        const newScores = scores.slice(0);
        newMembers.splice(index, 1);
        newScores.splice(index, 1);
        setMembers(newMembers);
        setScores(newScores);
      }
    } finally {
      setSaving(false);
    }
  }, [isSaving, members, scores, redis, keyName]);

  return {
    members,
    scores,
    isLoading,
    isSaving,
    pattern,
    loadMembersAndScores,
    addMemberAndScore,
    updateScore,
    deleteMember
  };
}

/**
 * @param {string} keyName 
 * @param {string} pattern 
 * @returns {Promise<[string[], number[]]>}
 */
function getZsetMembersStartWithPattern(redis, keyName, pattern = '*') {
  return getZsetMembers(
    redis,
    keyName,
    pattern.endsWith('*') ? pattern : `${pattern}*`
  );
}

/**
 * @param {string} pattern 
 * @returns {Promise<[string[], number[]]>}
 */
async function getZsetMembers(redis, keyName, pattern = '*') {
  const cursor = 0;
  const count = 1000;
  const [_, values] = await redis.zscan( // eslint-disable-line no-unused-vars
    keyName,
    cursor,
    'MATCH',
    pattern,
    'COUNT',
    count
  );
  return partitionByParity(values);
}

const DEFAULT_SCORE = 0;

/**
 * @never {this}
 */
async function addMemberToZsetIfNotExists(redis, keyName, newMember, score = DEFAULT_SCORE) {
  if (await isMemberOfZset(redis, keyName, newMember)) {
    throw new DuplicateMemberError('zset');
  } else {
    return addMemberToZset(redis, keyName, newMember, score);
  }
}

async function addMemberToZset(redis, keyName, newMember, score = DEFAULT_SCORE) {
  await redis.zadd(keyName, score, newMember);
}

async function isMemberOfZset(redis, keyName, member) {
  const score = await redis.zscore(keyName, member);
  return score != null;
}

async function updateZsetMember(redis, keyName, member, newScore = DEFAULT_SCORE) {
  await redis.zadd(keyName, newScore, member);
}

async function deleteMemberFromZset(redis, keyName, member) {
  await redis.zrem(keyName, member);
}
