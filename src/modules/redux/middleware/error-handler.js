import { actions as errorActions } from '../error';

export default function errorHandler() {
  return ({ dispatch }) => next => action => {
    if (action.type && action.error) {
      dispatch(errorActions.showError(action.error));
    }
    return next(action);
  };
}