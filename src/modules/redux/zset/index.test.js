import reducer, { actions } from './index';
import assert from 'assert';

describe('zset duck', () => {
  it('can handle FILTER_ZSET_MEMBERS_SUCCESS', () => {
    const previousState = { isLoading: true };
    const action = actions.filterZsetMembersSuccess(['hoge', 'fuga'], [1, 2]);
    const result = reducer(previousState, action);

    assert(!result.isLoading);
    assert.deepEqual(result.members, ['hoge', 'fuga']);
    assert.deepEqual(result.scores, [1, 2]);
  });

  it('can handle UPDATE_ZSET_MEMBER_SUCCESS', () => {
    const previousState = { members: ['hoge', 'piyo'], scores: [1, 2] };
    const action = actions.updateZsetMemberSuccess('piyo', 'FUGA', 40);
    const result = reducer(previousState, action);

    assert.deepEqual(result.members, ['hoge', 'FUGA']);
    assert.deepEqual(result.scores, [1, 40]);
  });

  it('can handle ADD_MEMBER_TO_ZSET_SUCCESS', () => {
    const previousState = { members: ['piyo'], scores: [100] };
    const action = actions.addMemberToZsetSuccess('HOGE', 50);
    const result = reducer(previousState, action);

    assert.deepEqual(result.members, ['HOGE', 'piyo']);
    assert.deepEqual(result.scores, [50, 100]);
  });

  it('can handle DELETE_MEMBER_FROM_ZSET_SUCCESS', () => {
    const previousState = { members: ['piyo', 'fuga', 'hoge'], scores: [1, 2, 3] };
    const action = actions.deleteMemberFromZsetSuccess('fuga');
    const result = reducer(previousState, action);

    assert.deepEqual(result.members, ['piyo', 'hoge']);
    assert.deepEqual(result.scores, [1, 3]);
  });
});