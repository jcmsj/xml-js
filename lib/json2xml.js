import { js2xml } from './js2xml';
export function json2xml(json, options) {
  if (json instanceof Buffer) {
    json = json.toString();
  }
  let js; //= null;
  if (typeof json === 'string') {
    try {
      js = JSON.parse(json);
    } catch (e) {
      throw new Error('Invalid JSON structure!');
    }
  } else {
    js = json;
  }
  return js2xml(js, options);
};

export default js2xml;