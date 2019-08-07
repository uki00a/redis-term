import blessed from 'neo-blessed';
import streamBuffers from 'stream-buffers';

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

