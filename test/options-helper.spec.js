import { ensureFlagExists, ensureKeyExists } from '../lib/options-helper';

/*global describe,it,expect*/

describe('Testing options.js:', function () {

  describe('Helpers:', function () {

    describe('Copy options:', function () {

      it('Copy unprovided options', function () {
        expect({}).toEqual({});
      });

      it('Copy provided options', function () {
        const options = {ignoreText: true, textKey: true};
        expect(copyOptions(options)).toEqual(options);
      });

    });

    describe('Ensure flag existance:', function () {

      it('New flag', function () {
        const options = {};
        ensureFlagExists('foo', options);
        expect(options).toEqual({foo: false});
      });

      it('Existing flag, not boolean', function () {
        const options = {foo: 123};
        ensureFlagExists('foo', options);
        expect(options).toEqual({foo: false});
      });

      it('Existing flag', function () {
        const options = {foo: true};
        ensureFlagExists('foo', options);
        expect(options).toEqual({foo: true});
      });

    });

    describe('Ensure key existance:', function () {

      it('New key', function () {
        const options = {};
        ensureKeyExists('foo', options);
        expect(options).toEqual({fooKey: 'foo'});
      });

      it('Existing key, not string', function () {
        const options = {fooKey: 123};
        ensureKeyExists('foo', options);
        expect(options).toEqual({fooKey: 'foo'});
      });

      it('Existing key, string', function () {
        const options = {fooKey: 'baa'};
        ensureKeyExists('foo', options);
        expect(options).toEqual({fooKey: 'baa'});
      });

    });

  });

});
