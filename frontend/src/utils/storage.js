const storagePrefix = 'timetracker_react_';

export function getFromStorage(key, initialValue = '') {
  const saved = localStorage.getItem(`${storagePrefix}${key}`);
  if (saved) {
    return JSON.parse(saved);
  } else {
    return initialValue;
  }
}

export function setToStorage(key, value) {
  localStorage.setItem(`${storagePrefix}${key}`, value);
}

export function checkToken() {
  const stored = localStorage.getItem(`${storagePrefix}token`);

  if (stored) {
    return true;
  }

  return false;
}

export function clearUserData() {
  localStorage.removeItem(`${storagePrefix}user`);
  localStorage.removeItem(`${storagePrefix}token`);
}
