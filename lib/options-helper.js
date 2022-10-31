import isArray from "./array-helper"

export function ensureFlagExists(item, options) {
  if (!(item in options) || typeof options[item] !== 'boolean') {
    options[item] = false;
  }
}

export function ensureFlagsExist(items, option) {
  items.map(item => ensureFlagExists(item, option))
}
export function ensureSpacesExists(options) {
  if (!('spaces' in options) || (typeof options.spaces !== 'number' && typeof options.spaces !== 'string')) {
    options.spaces = 0;
  }
}

export function ensureAlwaysArrayExists(options) {
  if (!('alwaysArray' in options) || (typeof options.alwaysArray !== 'boolean' && !isArray(options.alwaysArray))) {
    options.alwaysArray = false;
  }
}

export function ensureKeyExists(key, options) {
  if (!(key + 'Key' in options) || typeof options[key + 'Key'] !== 'string') {
    options[key + 'Key'] = options.compact ? '_' + key : key;
  }
}

export function ensureKeysExist(keys, options) {
  keys.map(key => ensureKeyExists(key, options))
}

export function checkFnExists(key, options) {
  return key + 'Fn' in options;
}

export function checkFNsExist(keys, options) {
  keys.map(key => checkFnExists(keys, options))
}