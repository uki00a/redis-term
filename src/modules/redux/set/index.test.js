import reducer, { actions } from './index';
import assert from 'assert';

describe('set duck', () => {
  it('can handle FILTER_SET_MEMBERS_SUCCESS', () => {
    const previousState = { isLoading: true };
    const action = actions.filterSetMembersSuccess(['hoge', 'piyo']);
    const result = reducer(previousState, action);

    assert(!result.isLoading);
    assert.deepEqual(result.members, ['hoge', 'piyo']);
  });

  it('can handle ADD_MEMBER_TO_SET_SUCCESS', () => {
    {
      const previousState = { members: ['hoge', 'fuga'] };
      const action = actions.addMemberToSetSuccess('piyo');
      const result = reducer(previousState, action);

      assert.deepEqual(result.members, ['hoge', 'fuga', 'piyo']);
    }

    {
      const previousState = { members: ['hoge', 'fuga'] };
      const action = actions.addMemberToSetSuccess('fuga');
      const result = reducer(previousState, action);

      assert.deepEqual(result.members, ['hoge', 'fuga'], 'duplicate members should not be added');
    }
  });

  it('can handle UPDATE_SET_MEMBER_SUCCESS', () => {
    {
      const previousState = { members: ['hoge', 'piyo' ] };
      const action = actions.updateSetMemberSuccess('piyo', 'fuga');
      const result = reducer(previousState, action);

      assert.deepEqual(result.members, ['hoge', 'fuga']);
    }

    {
      const previousState = { members: ['hoge', 'piyo'] };
      const action = actions.updateSetMemberSuccess('piyo', 'hoge');
      const result = reducer(previousState, action);

      assert.deepEqual(result.members, ['hoge'], 'duplicate members should not be added');
    }
  });

  it('can handle DELETE_MEMBER_FROM_SET_SUCCESS', () => {
    const previousState = { members: ['piyo', 'hoge', 'fuga'] };
    const action = actions.deleteMemberFromSetSuccess('hoge');
    const result = reducer(previousState, action);

    assert.deepEqual(result.members, ['piyo', 'fuga']);
  });
});