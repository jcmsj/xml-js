import { xml2json } from '..';
const xml =
'<?xml version="1.0" encoding="utf-8"?>' + '\n' +
'<note importance="high" logged="true">' + '\n' +
'    <title>Happy</title>' + '\n' +
'    <todo>Work</todo>' + '\n' +
'    <todo>Play</todo>' + '\n' +
'</note>';
const result1 = xml2json(xml, {compact: true});
const result2 = xml2json(xml, {compact: false});
console.log(result1, '\n', result2);
