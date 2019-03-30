import debounce from 'lodash/debounce';

const makeFocusHandler = method => debounce(element => {
  if (isForm(element)) {
    element[method]();
  } else {
    element.screen[method]();
  }
});

const isForm = element => Boolean(element.submit);
const focusNext = makeFocusHandler('focusNext');
const focusPrevious = makeFocusHandler('focusPrevious');

export const enableTabFocus = element => {
  const keypressListener = (_, ch, key) => {
    switch (key.full) {
    case 'tab':
      focusNext(element);
      break;
    case 'S-tab':
      focusPrevious(element);
      break;
    }
  };
  const removeListener = () => {
    element.removeListener('element keypress', keypressListener);
  };
  element.on('element keypress', keypressListener);
  return removeListener;
};
