import blessed from 'neo-blessed';
import streamBuffers from 'stream-buffers';
import assert from 'assert';

export function createScreen() {
  const screen = blessed.screen({
    autopadding: true,
    smartCSR: true,
    fullUnicode: true,
    //input: new streamBuffers.ReadableStreamBuffer({
    //  frequency: 16, 
    //  chunkSize: 0
    //}),
    output: new streamBuffers.WritableStreamBuffer({
      initialSize: 0, 
      incrementAmount: 0
    })
  });

  screen.program.disableMouse();
  return screen;
}

export const waitFor = (
  test,
  {
    timeout = 500,
    interval = 50
  } = {}
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

export const waitForElementToBeHidden = (
  test,
  options = {}
) => {
  return waitFor(() => {
    const element = test();
    assert(!Array.isArray(element));
    if (element.hidden) {
      return element;
    } else {
      throw new Error('an element is visible');
    }
  }, options);
};

export const waitForElementToBeRemoved = (
  test,
  options = {}
) => {
  return waitFor(() => {
    try {
      test();
    } catch (error) {
      if (error instanceof ElementNotFoundError) {
        return true;
      }
      throw error;
    }
  }, options);
};

export const waitForEvent = (
  node,
  event,
  options = { timeout: 500 }
) => new Promise((resolve, reject) => {
  const { timeout = 500 } = options

  let wasTimedout = false;

  const listener = () => {
    if (!wasTimedout) {
      clearTimeout(timer);
      resolve();
    }
  };

  const timer = setTimeout(() => {
    wasTimedout = true;
    node.removeListener(event, listener);
    reject(new Error('waitForEvent: timeout'));
  }, timeout);

  node.once(event, listener);
});

export const waitForItemsToBeChanged = (list, options) => waitForEvent(
  list,
  'set items', // FIXME This is undocumented.
  options
);

export const createGetters = screen => ({
  queryBy: predicate => getBy(screen, predicate),
  getBy: predicate => getBy(screen, predicate),
  getByType: type => getByType(screen, type),
  getByContent: content => getByContent(screen, content)
});

const getByType = (screen, type) => {
  return getBy(screen, x => x.type === type);
};

const getByContent = (screen, content) => {
  const predicate = content instanceof RegExp
    ? x => x.getContent && content.test(x.getContent())
    : x => x.getContent && x.getContent() === content;
  return getBy(screen, predicate);
};

const getBy = (screen, predicate) => {
  const found = queryBy(screen, predicate);
  if (found == null) {
    throw new ElementNotFoundError(`no element was found`);
  }
  return found;
};

function queryBy(screen, predicate) {
  const queue = [screen];
  const seen = new Set();
  while (queue.length > 0) {
    const node = queue.pop();
    if (seen.has(node)) {
      throw new Error('invalid screen');
    }
    seen.add(node);
    if (predicate(node)) {
      return node;
    }
    for (const child of node.children) {
      queue.push(child);
    }
  }
}

class ElementNotFoundError extends Error {}

export const fireEvent = {
  click: node => node.emit('click'),
  keypress: (node, ch, key) => node.emit('keypress', ch, key)
};

export const simulate = {
  keypress: (node, key) => fireEvent.keypress(node, null, { full: key, name: key }),
  select: (list, index) => {
    list.select(index);
    return simulate.keypress(list, 'enter');
  }
};
