import assert from 'assert';
import reducer, { actions } from './index';
import { noop } from '../../utils';

describe('keyboard bindings duck', () => {
   it('can handle ENABLE_KEYBOARD_BINDINGS', () => {
     const previousKeyboardBindings = [
       { key: 'C-c', handler: noop, description: 'test' }
     ];
     const givenKeyboardBindings = [
       { key: 'C-r', handler: noop, description: 'Reload' },
       { key: 'C-d', handler: noop, description: 'Delete Key' }
     ];
     const action = actions.enableKeyboardBindings(givenKeyboardBindings);
     const result = reducer(previousKeyboardBindings, action);

     assert.deepEqual(result, givenKeyboardBindings);
   }); 
});
