import { createContainer, useContainer as _useContainer } from 'unstated-next';
import { useConnections } from './connections';
import { useKeyboardBindings } from './keyboard-bindings';

export const ConnectionsContainer = createContainer(useConnections);
export const KeyboardBindingsContainer = createContainer(useKeyboardBindings);

export const useContainer = _useContainer;