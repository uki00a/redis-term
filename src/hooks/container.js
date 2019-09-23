import { createContainer, useContainer as _useContainer } from 'unstated-next';
import { useConnections } from './connections';

export const ConnectionsContainer = createContainer(useConnections);

export const useContainer = _useContainer;