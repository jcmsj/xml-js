import { js2xml, json2xml } from '../lib';
import testItems from './test-items';

/*global describe,it,expect*/

describe('Testing js2xml.js:', function () {

  describe('No options supplied (fallback to defaults):', function () {

    const options = {};
    testItems('js2xml', options).forEach(function (test) {
      it(test.desc, function () {
        expect(js2xml(test.js, options)).toEqual(test.xml);
      });
    });

  });

  describe('options = {compact: false}', function () {

    describe('Options set to default values explicitly:', function () {

      const options = {compact: false, spaces: 0, ignoreText: false, ignoreComment: false, ignoreCdata: false, fullTagEmptyElement: false};
      testItems('js2xml', options).forEach(function (test) {
        it(test.desc, function () {
          expect(js2xml(test.js, options)).toEqual(test.xml);
        });
      });

    });

    describe('options = {spaces: 4}', function () {

      const options = {spaces: 4, onlyItem: 8};
      testItems('js2xml', options).forEach(function (test) {
        it(test.desc, function () {
          expect(js2xml(test.js, options)).toEqual(test.xml);
        });
      });

    });

    describe('options = {spaces: 0}', function () {

      const options = {spaces: 0};
      testItems('js2xml', options).forEach(function (test) {
        it(test.desc, function () {
          expect(js2xml(test.js, options)).toEqual(test.xml);
        });
      });

    });

    describe('options = {spaces: 0, ignoreText: true}', function () {

      const options = {spaces: 0, ignoreText: true};
      testItems('js2xml', options).forEach(function (test) {
        it(test.desc, function () {
          expect(js2xml(test.js, options)).toEqual(test.xml);
        });
      });

    });

    describe('options = {spaces: 0, ignoreComment: true}', function () {

      const options = {spaces: 0, ignoreComment: true};
      testItems('js2xml', options).forEach(function (test) {
        it(test.desc, function () {
          expect(js2xml(test.js, options)).toEqual(test.xml);
        });
      });

    });

    describe('options = {spaces: 0, ignoreCdata: true}', function () {

      const options = {spaces: 0, ignoreCdata: true};
      testItems('js2xml', options).forEach(function (test) {
        it(test.desc, function () {
          expect(js2xml(test.js, options)).toEqual(test.xml);
        });
      });

    });

    describe('options = {spaces: 0, ignoreDoctype: true}', function () {

      const options = {spaces: 0, ignoreDoctype: true};
      testItems('js2xml', options).forEach(function (test) {
        it(test.desc, function () {
          expect(js2xml(test.js, options)).toEqual(test.xml);
        });
      });

    });

    describe('options = {spaces: 0, ignoreDeclaration: true}', function () {

      const options = {spaces: 0, ignoreDeclaration: true};
      testItems('js2xml', options).forEach(function (test) {
        it(test.desc, function () {
          expect(js2xml(test.js, options)).toEqual(test.xml);
        });
      });

    });

    describe('options = {spaces: 0, ignoreInstruction: true}', function () {

      const options = {spaces: 0, ignoreInstruction: true};
      testItems('js2xml', options).forEach(function (test) {
        it(test.desc, function () {
          expect(js2xml(test.js, options)).toEqual(test.xml);
        });
      });

    });

    describe('options = {spaces: 0, fullTagEmptyElement: true}', function () {

      const options = {spaces: 0, fullTagEmptyElement: true};
      testItems('js2xml', options).forEach(function (test) {
        it(test.desc, function () {
          expect(js2xml(test.js, options)).toEqual(test.xml);
        });
      });

    });

  });

  describe('options = {compact: true}', function () {

    describe('Options set to default values explicitly:', function () {

      const options = {compact: true, spaces: 0, ignoreText: false, ignoreComment: false, ignoreCdata: false, fullTagEmptyElement: false};
      testItems('js2xml', options).forEach(function (test) {
        it(test.desc, function () {
          expect(js2xml(test.js, options)).toEqual(test.xml);
        });
      });

    });

    describe('options = {spaces: 4}', function () {

      const options = {compact: true, spaces: 4};
      testItems('js2xml', options).forEach(function (test) {
        it(test.desc, function () {
          expect(js2xml(test.js, options)).toEqual(test.xml);
        });
      });

    });

    describe('options = {spaces: 0}', function () {

      const options = {compact: true, spaces: 0};
      testItems('js2xml', options).forEach(function (test) {
        it(test.desc, function () {
          expect(js2xml(test.js, options)).toEqual(test.xml);
        });
      });

    });

    describe('options = {spaces: 0, ignoreText: true}', function () {

      const options = {compact: true, spaces: 0, ignoreText: true};
      testItems('js2xml', options).forEach(function (test) {
        it(test.desc, function () {
          expect(js2xml(test.js, options)).toEqual(test.xml);
        });
      });

    });

    describe('options = {spaces: 0, ignoreComment: true}', function () {

      const options = {compact: true, spaces: 0, ignoreComment: true};
      testItems('js2xml', options).forEach(function (test) {
        it(test.desc, function () {
          expect(js2xml(test.js, options)).toEqual(test.xml);
        });
      });

    });

    describe('options = {spaces: 0, ignoreCdata: true}', function () {

      const options = {compact: true, spaces: 0, ignoreCdata: true};
      testItems('js2xml', options).forEach(function (test) {
        it(test.desc, function () {
          expect(js2xml(test.js, options)).toEqual(test.xml);
        });
      });

    });

    describe('options = {spaces: 0, ignoreDoctype: true}', function () {

      const options = {compact: true, spaces: 0, ignoreDoctype: true};
      testItems('js2xml', options).forEach(function (test) {
        it(test.desc, function () {
          expect(js2xml(test.js, options)).toEqual(test.xml);
        });
      });

    });

    describe('options = {spaces: 0, ignoreDeclaration: true}', function () {

      const options = {compact: true, spaces: 0, ignoreDeclaration: true};
      testItems('js2xml', options).forEach(function (test) {
        it(test.desc, function () {
          expect(js2xml(test.js, options)).toEqual(test.xml);
        });
      });

    });

    describe('options = {spaces: 0, ignoreInstruction: true}', function () {

      const options = {compact: true, spaces: 0, ignoreInstruction: true};
      testItems('js2xml', options).forEach(function (test) {
        it(test.desc, function () {
          expect(js2xml(test.js, options)).toEqual(test.xml);
        });
      });

    });

    describe('options = {spaces: 0, fullTagEmptyElement: true}', function () {

      const options = {compact: true, spaces: 0, fullTagEmptyElement: true};
      testItems('js2xml', options).forEach(function (test) {
        it(test.desc, function () {
          expect(js2xml(test.js, options)).toEqual(test.xml);
        });
      });

    });

  });

  describe('Varying spaces', function () {

    describe('options = {}', function () {

      const options = {};
      testItems('js2xml', options).forEach(function (test) {
        it(test.desc, function () {
          expect(js2xml(test.js, options)).toEqual(test.xml);
        });
      });

    });

    describe('options = {spaces: true}', function () {

      const options = {spaces: true};
      testItems('js2xml', options).forEach(function (test) {
        it(test.desc, function () {
          expect(js2xml(test.js, options)).toEqual(test.xml);
        });
      });

    });

    describe('options = {spaces: 2}', function () {

      const options = {spaces: 2};
      testItems('js2xml', options).forEach(function (test) {
        it(test.desc, function () {
          expect(js2xml(test.js, options)).toEqual(test.xml);
        });
      });

    });

    describe('options = {spaces: 4}', function () {

      const options = {spaces: 4};
      testItems('js2xml', options).forEach(function (test) {
        it(test.desc, function () {
          expect(js2xml(test.js, options)).toEqual(test.xml);
        });
      });

    });

    describe('options = {spaces: \'  \'}', function () {

      const options = {spaces: '  '};
      testItems('js2xml', options).forEach(function (test) {
        it(test.desc, function () {
          expect(js2xml(test.js, options)).toEqual(test.xml);
        });
      });

    });

    describe('options = {spaces: \\t}', function () {

      const options = {spaces: '\t'};
      testItems('js2xml', options).forEach(function (test) {
        it(test.desc, function () {
          expect(js2xml(test.js, options)).toEqual(test.xml);
        });
      });

    });

  });

  describe('json2xml:', function () {

    describe('using default options', function () {

      const options = {};
      testItems('js2xml', options).forEach(function (test) {
        it(test.desc, function () {
          expect(json2xml(JSON.stringify(test.js), options)).toEqual(test.xml);
        });
      });

    });

    describe('submitting json as javascript object', function () {

      const options = {};
      testItems('js2xml', options).forEach(function (test) {
        it(test.desc, function () {
          expect(json2xml(test.js, options)).toEqual(test.xml);
        });
      });

    });

    describe('using buffer', function () {

      const options = {};
      testItems('js2xml', options).forEach(function (test) {
        it(test.desc, function () {
          expect(json2xml(new Buffer.from(JSON.stringify(test.js)), options)).toEqual(test.xml);
        });
      });

    });

    describe('improper json', function () {

      try {
        json2xml('{a:', {});
      } catch (e) {
        e.note = 'ignore me';
      }

    });

  });

  describe('Various options:', function () {

    describe('options = {instructionHasAttributes: true}', function () {

      it('Write processing instruction attributes, {compact: true}', function () {
        expect(js2xml({"_instruction":{"go":{"_attributes":{"to":"there"}}}}, {compact: true})).toEqual('<?go to="there"?>');
      });

      it('Write processing instruction attributes, {compact: false}', function () {
        expect(js2xml({"elements":[{"type":"instruction","name":"go","attributes":{"to":"there"}}]})).toEqual('<?go to="there"?>');
      });

    });

  });

});
