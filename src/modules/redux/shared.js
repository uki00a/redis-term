/**
 * @param {() => import('./store').State} getState 
 * @returns {string}
 */
export const getSelectedKey = getState => getState().keys.selectedKeyName;