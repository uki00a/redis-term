import reducer, { actions } from './index';
import assert from 'assert';

describe('set duck', () => {
  it('can handle GET_SET_MEMBERS_SUCCESS', () => {
    const previousState = { isLoading: true };
    const action = actions.getSetMembersSuccess(['hoge', 'piyo']);
    const result = reducer(previousState, action);

    assert.equal(result.isLoading, false);
    assert.deepEqual(result.members, ['hoge', 'piyo']);
  });

  it('can handle ADD_MEMBER_TO_SET_SUCCESS', () => {
    const previousState = { members: ['hoge', 'fuga'] };
    const action = actions.addMemberToSetSuccess('piyo');
    const result = reducer(previousState, action);

    assert.deepEqual(result.members, ['hoge', 'fuga', 'piyo']);
    assert.equal(result.isSaving, false);
  });

  it('can handle DELETE_MEMBER_FROM_SET_SUCCESS', () => {
    const previousState = { members: ['piyo', 'hoge', 'fuga'] };
    const action = actions.deleteMemberFromSetSuccess('hoge');
    const result = reducer(previousState, action);

    assert.deepEqual(result.members, ['piyo', 'fuga']);
    assert.equal(result.isSaving, false);
  });
});