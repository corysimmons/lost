'use strict';

var expect = require('chai').expect;
var { lost } = require('../dist/lost');
var postcss = require('postcss');
var CssSyntaxError = require('postcss').CssSyntaxError;

module.exports = function throws(input, message, opts) {
  var processor = postcss([lost(opts)]);
  expect(() => {
    return processor.process(input).css;
  }).to.throw(CssSyntaxError, message);
};
