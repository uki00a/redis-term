import { EventEmitter } from 'events';
import TestRenderer from 'react-test-renderer';

export const waitForElement = (
  test,
  timeout = 500,
  interval = 50
) => {
  const startTime = Date.now();
  return new Promise((resolve, reject) => {
    const wasTimedout = () => Date.now() - startTime >= timeout;
    const rejectOrWaitForElement = error => {
      if (wasTimedout()) {
        return reject(error);
      }
      setTimeout(checkElement, interval);
    };
    const checkElement = () => {
      try {
        const result = test();
        resolve(result);
      } catch (error) {
        rejectOrWaitForElement(error);
      }
    };
    setTimeout(checkElement, 0);
  });
};

const eventNameToHandlerName = eventName => {
  return `on${eventName.charAt(0).toUpperCase()}${eventName.slice(1)}`;
};
const findEventHandler = (element, eventName) => {
  const handlerName = eventNameToHandlerName(eventName);
  if (typeof element.props[handlerName] !== 'undefined') {
    return element.props[handlerName];
  }
  if (element.parent == null) {
    throw new Error(`no handler function found for event: ${eventName}`);
  }
  return findEventHandler(element.parent, eventName);
};
const makeEventFirer = eventName => (element, ...args) => {
  const handler = findEventHandler(element, eventName);
  return handler(...args);
};

export const fireEvent = {
  focus: makeEventFirer('focus'),
  click: makeEventFirer('click'),
  keypress: makeEventFirer('keypress')
};

export const render = component => {
  clearNodeMockCache();
  const renderer = TestRenderer.create(component, DEFAULT_RENDERER_OPTIONS);
  const instance = renderer.root;
  return {
    ...createGetters(instance)  
  };
};

const nodeMockCache = new Map();
const clearNodeMockCache = () => nodeMockCache.clear();
const createNodeMock = element => {
  // FIXME
  const hasSeenElement = nodeMockCache.has(element.props);
  if (hasSeenElement) {
    return nodeMockCache.get(element.props);
  } else {
    const mock = new NodeMock(element);
    nodeMockCache.set(element.props, mock);
    return mock;
  }
};

const noop = () => {};
class NodeMock extends EventEmitter {
  constructor(element) {
    super();
    this._element = element;
  }
  get type() {
    return this._element.type;
  }
  setValue(value) {
    this.value = value;
  }
  readInput() {

  }
}
NodeMock.prototype.load = noop;
NodeMock.prototype.stop = noop;

const nodeHasContent = (node, content) => {
  if ('content' in node.props) {
    return typeof content === 'string'
      ? content === node.props.content
      : content.test(node.props.content);
  } else {
    return false;
  }
};

const createGetters = instance => {
  return {
    getAllByProps: getAllByProps(instance),
    getAllByType: getAllByType(instance),
    getByType: type => instance.findByType(type),
    getAllByContent: getAllByContent(instance)
  };
};
const getAllByProps = instance => raiseIfNoInstanceFound(props => instance.findAllByProps(props));
const getAllByType = instance => raiseIfNoInstanceFound(type => instance.findAllByType(type));
const getAllByContent = instance => raiseIfNoInstanceFound(content => instance.findAll(node => nodeHasContent(node, content)));
const raiseIfNoInstanceFound = finder => (...args) => {
  const result = finder(...args);
  if (result.length === 0) {
    throw new Error('no instance was found');
  } else {
    return result;
  }
};

const getAll = getter => {
  const result = getter();
  if (result.length === 0) {
    throw new Error('no instance was found');
  } else {
    return result;
  }
};


export const simulateInput = (element, value) => {
  element.instance.setValue(value);
};

const DEFAULT_RENDERER_OPTIONS = { createNodeMock };
