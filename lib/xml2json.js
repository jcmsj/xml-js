import { ensureSpacesExists } from './options-helper';
import xml2js from './xml2js';

function validateOptions (userOptions) {
  const options = {...userOptions};
  ensureSpacesExists(options);
  return options;
}

export function xml2json(xml, userOptions) {
  let json;
  const options = validateOptions(userOptions);
  const js = xml2js(xml, options);
  const parentKey = 'compact' in options && options.compact ? '_parent' : 'parent';
  // parentKey = ptions.compact ? '_parent' : 'parent'; // consider this
  if ('addParent' in options && options.addParent) {
    json = JSON.stringify(js, function (k, v) { return k === parentKey? '_' : v; }, options.spaces);
  } else {
    json = JSON.stringify(js, null, options.spaces);
  }
  return json.replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
};