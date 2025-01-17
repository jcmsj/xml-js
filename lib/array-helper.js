export function isArray(value) {
  if (Array.isArray) {
    return Array.isArray(value);
  }
  // fallback for older browsers like  IE 8
  return Object.prototype.toString.call(value) === '[object Array]';
}

export default isArray;