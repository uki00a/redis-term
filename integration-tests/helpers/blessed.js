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
    throw new Error(`no element was found`);
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

export const fireEvent = {
  click: node => node.emit('click'),
  keypress: (node, ch, key) => node.emit('keypress', ch, key)
};

export const simulate = {
  keypress: (node, key) => fireEvent.keypress(node, null, { full: key, name: key })
};
