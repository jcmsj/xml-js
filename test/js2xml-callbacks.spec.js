var convert = require('../lib');

/*global describe,it,expect*/

var args;

function manipulate(val) {
  args = arguments;
  return val.toUpperCase();
}

function manipulateAttribute(obj) {
  args = arguments;
  var key, temp;
  for (key in obj) {
    temp = obj[key];
    delete obj[key];
    obj[key.toUpperCase()] = temp.toUpperCase();
  }
  return obj;
}

function fullTag(name) {
  args = arguments;
  return name === 'b';
}

describe('Testing js2xml.js:', function () {

  describe('Adding function callbacks, options = {compact: false}', function () {

    describe('options = {doctypeFn: manipulate}', function () {

      const js = {"elements":[{"type":"doctype","doctype":"note [\n<!ENTITY foo \"baa\">]"}]};
      const xml = '<!DOCTYPE ' + manipulate('note [\n<!ENTITY foo "baa">]') + '>';
      it('<!DOCTYPE note [\\n<!ENTITY foo "baa">]>', function () {
        expect(convert.js2xml(js, {compact: false, doctypeFn: manipulate})).toEqual(xml);
      });
      it('should provide correct arguments', function () {
        expect(args).toContain('note [\n<!ENTITY foo "baa">]', '_root_', js);
      });

    });

    describe('options = {instructionFn: manipulate}', function () {

      const js = {"elements":[{"type":"instruction","name":"go","instruction":"there"}]};
      const xml = '<?go ' + manipulate('there') + '?>';
      it('<?go there?>', function () {
        expect(convert.js2xml(js, {compact: false, instructionFn: manipulate})).toEqual(xml);
      });
      it('should provide correct arguments', function() {
          expect(args).toContain('there', 'go', '_root_', js);
        });

    });

    describe('options = {cdataFn: manipulate}', function () {

      const js = {"elements":[{"type":"cdata","cdata":" \t <foo></bar> \t "}]};
      const xml = '<![CDATA[' + manipulate(' \t <foo></bar> \t ') + ']]>';
      it('<![CDATA[ \t <foo></bar> \t ]]>', function () {
        expect(convert.js2xml(js, {compact: false, cdataFn: manipulate})).toEqual(xml);
      });
      it('should provide correct arguments', function () {
        expect(args).toContain(' \t <foo></bar> \t ', '_root_', js);
        // console.log(JSON.stringify(args));
      });

    });

    describe('options = {commentFn: manipulate}', function () {

      const js = {"elements":[{"type":"comment","comment":" \t Hello, World! \t "}]};
      const xml = '<!--' + manipulate(' \t Hello, World! \t ') + '-->';
      it('<!-- \t Hello, World! \t -->', function () {
        expect(convert.js2xml(js, {compact: false, commentFn: manipulate})).toEqual(xml);
      });
      it('should provide correct arguments', function () {
        expect(args).toContain(' \t Hello, World! \t ', '_root_', js);
      });

    });

    describe('options = {textFn: manipulate}', function () {

      const js = {"elements":[{"type":"element","name":"a","elements":[{"type":"text","text":" \t Hi \t "}]}]};
      const xml = '<a>' + manipulate(' \t Hi \t ') + '</a>';
      it('<a> \t Hi \t </a>', function () {
        expect(convert.js2xml(js, {compact: false, textFn: manipulate})).toEqual(xml);
      });
      it('should provide correct arguments', function () {
        expect(args).toContain(' \t Hi \t ', 'a', js.elements[0]);
      });

    });

    describe('options = {instructionNameFn: manipulate}', function () {

      const js = {"elements":[{"type":"instruction","name":"go","instruction":"there"}]};
      const xml = '<?' + manipulate('go') + ' there?>';
      it('<?go there?>', function () {
        expect(convert.js2xml(js, {compact: false, instructionNameFn: manipulate})).toEqual(xml);
      });
      it('should provide correct arguments', function () {
        expect(args).toContain('go', '_root_', js);
      });

    });

    describe('options = {elementNameFn: manipulate}', function () {

      const js = {"elements":[{"type":"element","name":"a","attributes":{"x":"hello"}}]};
      const xml = '<' + manipulate('a') + ' x="hello"/>';
      it('<a x="hello"/>', function () {
        expect(convert.js2xml(js, {compact: false, elementNameFn: manipulate})).toEqual(xml);
      });
      it('should provide correct arguments', function () {
        expect(args).toContain('a', js.elements[0]);
      });

    });

    describe('options = {attributeNameFn: manipulate}', function () {

      const js = {"elements":[{"type":"element","name":"a","attributes":{"x":"1.234","y":"It\'s"}}]};
      const xml = '<a ' + manipulate('x') + '="1.234" ' + manipulate('y') + '="It\'s"/>';
      it('<a x="1.234" y="It\'s"/>', function () {
        expect(convert.js2xml(js, {compact: false, attributeNameFn: manipulate})).toEqual(xml);
      });
      it('should provide correct arguments', function () {
        expect(args).toContain('y', 'It\'s', 'a', js.elements[0]);
      });

    });

    describe('options = {attributeValueFn: manipulate}', function () {

      const js = {"elements":[{"type":"element","name":"a","attributes":{"x":"1.234","y":"It\'s"}}]};
      const xml = '<a x="' + manipulate('1.234') + '" y="' + manipulate('It\'s') + '"/>';
      it('<a x="1.234" y="It\'s"/>', function () {
        expect(convert.js2xml(js, {compact: false, attributeValueFn: manipulate})).toEqual(xml);
      });
      it('should provide correct arguments', function () {
        expect(args).toContain('It\'s', 'y', 'a', js.elements[0]);
      });

    });

    describe('options = {attributesFn: manipulateAttribute}', function () {

      const js = {"elements":[{"type":"element","name":"a","attributes":{"x":"1.234","y":"It\'s"}}]};
      const xml = '<a ' + manipulate('x="1.234" y="It\'s"') + '/>';
      it('<a x="1.234" y="It\'s"/>', function () {
        expect(convert.js2xml(js, {compact: false, attributesFn: manipulateAttribute})).toEqual(xml);
      });
      it('should provide correct arguments', function () {
        expect(args).toContain({"X":"1.234","Y":"IT\'S"}, 'a', js.elements[0]);
      });

    });

  });

  describe('Adding function callbacks, options = {compact: true}', function () {

    describe('options = {doctypeFn: manipulate}', function () {

      const js = {"_doctype":"note [\n<!ENTITY foo \"baa\">]"};
      const xml = '<!DOCTYPE ' + manipulate('note [\n<!ENTITY foo "baa">]') + '>';
      it('<!DOCTYPE note [\\n<!ENTITY foo "baa">]>', function () {
        expect(convert.js2xml(js, {compact: true, doctypeFn: manipulate})).toEqual(xml);
      });
      it('should provide correct arguments', function () {
        expect(args).toContain('note [\n<!ENTITY foo "baa">]', '_root_', js);
      });

    });

    describe('options = {instructionFn: manipulate}', function () {

      const js = {"_instruction":{"go": "there"}};
      const xml = '<?go ' + manipulate('there') + '?>';
      it('<?go there?>', function () {
        expect(convert.js2xml(js, {compact: true, instructionFn: manipulate})).toEqual(xml);
      });
      it('should provide correct arguments', function () {
        expect(args).toContain('there', 'go', '_root_', js);
      });

    });

    describe('options = {cdataFn: manipulate}', function () {

      const js = {"_cdata":" \t <foo></bar> \t "};
      const xml = '<![CDATA[' + manipulate(' \t <foo></bar> \t ') + ']]>';
      it('<![CDATA[ \t <foo></bar> \t ]]>', function () {
        expect(convert.js2xml(js, {compact: true, cdataFn: manipulate})).toEqual(xml);
      });
      it('should provide correct arguments', function () {
        expect(args).toContain(' \t <foo></bar> \t ', '_root_', js);
      });

    });

    describe('options = {commentFn: manipulate}', function () {

      const js = {"_comment":" \t Hello, World! \t "};
      const xml = '<!--' + manipulate(' \t Hello, World! \t ') + '-->';
      it('<!-- \t Hello, World! \t -->', function () {
        expect(convert.js2xml(js, {compact: true, commentFn: manipulate})).toEqual(xml);
      });
      it('should provide correct arguments', function () {
        expect(args).toContain(' \t Hello, World! \t ', '_root_', js);
      });

    });

    describe('options = {textFn: manipulate}', function () {

      const js = {"a":{"_text":" \t Hi \t "}};
      const xml = '<a>' + manipulate(' \t Hi \t ') + '</a>';
      it('<a> \t Hi \t </a>', function () {
        expect(convert.js2xml(js, {compact: true, textFn: manipulate})).toEqual(xml);
      });
      it('should provide correct arguments', function () {
        expect(args).toContain(' \t Hi \t ', 'a', js.a);
      });

    });

    describe('options = {instructionNameFn: manipulate}', function () {

      const js = {"_instruction":{"go": "there"}};
      const xml = '<?' + manipulate('go') + ' there?>';
      it('<?go there?>', function () {
        expect(convert.js2xml(js, {compact: true, instructionNameFn: manipulate})).toEqual(xml);
      });
      it('should provide correct arguments', function () {
        expect(args).toContain('go', 'there', '_root_', js);
      });

    });

    describe('options = {elementNameFn: manipulate}', function () {

      const js = {"a":{_attributes:{"x":"hello"}}};
      const xml = '<' + manipulate('a') + ' x="hello"/>';
      it('<a x="hello"/>', function () {
        expect(convert.js2xml(js, {compact: true, elementNameFn: manipulate})).toEqual(xml);
      });
      it('should provide correct arguments', function () {
        expect(args).toContain('a', js.a);
      });

    });

    describe('options = {attributeNameFn: manipulate}', function () {

      const js = {"a":{_attributes:{"x":"1.234","y":"It\'s"}}};
      const xml = '<a ' + manipulate('x') + '="1.234" ' + manipulate('y') + '="It\'s"/>';
      it('<a x="1.234" y="It\'s"/>', function () {
        expect(convert.js2xml(js, {compact: true, attributeNameFn: manipulate})).toEqual(xml);
      });
      it('should provide correct arguments', function () {
        expect(args).toContain('y', 'It\'s', 'a', js.a);
      });

    });

    describe('options = {attributeValueFn: manipulate}', function () {

      const js = {"a":{_attributes:{"x":"1.234","y":"It\'s"}}};
      const xml = '<a x="' + manipulate('1.234') + '" y="' + manipulate('It\'s') + '"/>';
      it('<a x="1.234" y="It\'s"/>', function () {
        expect(convert.js2xml(js, {compact: true, attributeValueFn: manipulate})).toEqual(xml);
      });
      it('should provide correct arguments', function () {
        expect(args).toContain('It\'s', 'y', 'a', js.a);
      });

    });

    describe('options = {attributesFn: manipulateAttribute}', function () {

      const js = {"a":{_attributes:{"x":"1.234","y":"It\'s"}}};
      const xml = '<a ' + manipulate('x="1.234" y="It\'s"') + '/>';
      it('<a x="1.234" y="It\'s"/>', function () {
        expect(convert.js2xml(js, {compact: true, attributesFn: manipulateAttribute})).toEqual(xml);
      });
      it('should provide correct arguments', function () {
        expect(args).toContain({"X":"1.234","Y":"IT\'S"}, 'a', js.a);
      });

    });

  });

  describe('options = {fullTagEmptyElementFn: fullTag}', function () {

    describe('options = {compact: false}', function () {

      const js = {"elements":[{"type":"element","name":"a"},{"type":"element","name":"b"}]};
      const xml = '<a/><b></b>';
      it('<a/><b/>', function () {
        expect(convert.js2xml(js, {compact: false, fullTagEmptyElementFn: fullTag})).toEqual(xml);
      });
      it('should provide correct arguments', function () {
        expect(args).toContain('b', js.elements[1]);
      });

    });

    describe('options = {compact: true}', function () {

      const js = {"a":{},"b":{}};
      const xml = '<a/><b></b>';
      it('<a/><b/>', function () {
        expect(convert.js2xml(js, {compact: true, fullTagEmptyElementFn: fullTag})).toEqual(xml);
      });
      it('should provide correct arguments', function () {
        expect(args).toContain('b', js.b);
      });

    });

  });

});
