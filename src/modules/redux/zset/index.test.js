import reducer, { actions } from './index';
import assert from 'assert';

describe('zset duck', () => {
  it('can handle FILTER_ZSET_MEMBERS_SUCCESS', () => {
    const previousState = { isLoading: true };
    const action = actions.filterZsetMembersSuccess(['hoge', 'fuga'], [1, 2]);
    const result = reducer(previousState, action);

    assert.equal(result.isLoading, false);
    assert.deepEqual(result.members, ['hoge', 'fuga']);
    assert.deepEqual(result.scores, [1, 2]);
  });

  it('can handle UPDATE_ZSET_MEMBER_SUCCESS', () => {
    {
      const previousState = { members: ['hoge', 'piyo'], scores: [1, 2] };
      const action = actions.updateZsetMemberSuccess('piyo', 'FUGA', 40);
      const result = reducer(previousState, action);

      assert.deepEqual(result.members, ['hoge', 'FUGA']);
      assert.deepEqual(result.scores, [1, 40]);
      assert.equal(result.isSaving, false);
    }

    {
      const previousState = { members: ['a', 'b'], scores: [10, 20] };
      const action = actions.updateZsetMemberSuccess('b', 'b', 30);
      const result = reducer(previousState, action);

      assert.deepEqual(result.members, ['a', 'b'], 'updating only a score should correctly be handled');
      assert.deepEqual(result.scores, [10, 30], 'updating only a score should correctly be handled');
      assert.equal(result.isSaving, false);
    }

    {
      const previousState = { members: ['a', 'b'], scores: [10, 20] };
      const action = actions.updateZsetMemberSuccess('b', 'a', 10);
      const result = reducer(previousState, action);

      assert.deepEqual(result.members, ['a'], 'duplicate members should not be added');
      assert.deepEqual(result.scores, [10], 'duplicate members should not be added');
      assert.equal(result.isSaving, false);
    }

    {
      const previousState = { members: ['a', 'b', 'c'], scores: [1, 2, 3] };
      const action = actions.updateZsetMemberSuccess('b', 'b', 2);
      const result = reducer(previousState, action);

      assert.deepEqual(result.members, ['a', 'b', 'c']);
      assert.deepEqual(result.scores, [1, 2, 3]);
      assert.equal(result.isSaving, false);
    }

    {
      const previousState = { members: ['a'], scores: [1] };
      const action = actions.updateZsetMemberSuccess('a', 'a', 2);
      const result = reducer(previousState, action);

      assert.deepEqual(result.members, ['a']);
      assert.deepEqual(result.scores, [2]);
      assert.equal(result.isSaving, false);
    }
  });

  it('can handle ADD_MEMBER_TO_ZSET_SUCCESS', () => {
    {
      const previousState = { members: ['piyo'], scores: [100] };
      const action = actions.addMemberToZsetSuccess('HOGE', 50);
      const result = reducer(previousState, action);

      assert.deepEqual(result.members, ['HOGE', 'piyo']);
      assert.deepEqual(result.scores, [50, 100]);
      assert.equal(result.isSaving, false);
    }

    {
      const previousState = { members: ['a', 'b'], scores: [100, 200] };
      const action = actions.addMemberToZsetSuccess('b', 400);
      const result = reducer(previousState, action);

      assert.deepEqual(result.members, ['a', 'b'], 'duplicate members should not be added');
      assert.deepEqual(result.scores, [100, 400], 'duplicate members should not be added');
      assert.equal(result.isSaving, false);
    }
  });

  it('can handle DELETE_MEMBER_FROM_ZSET_SUCCESS', () => {
    const previousState = { members: ['piyo', 'fuga', 'hoge'], scores: [1, 2, 3] };
    const action = actions.deleteMemberFromZsetSuccess('fuga');
    const result = reducer(previousState, action);

    assert.deepEqual(result.members, ['piyo', 'hoge']);
    assert.deepEqual(result.scores, [1, 3]);
    assert.equal(result.isSaving, false);
  });
});