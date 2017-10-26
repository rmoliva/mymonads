const R = require('ramda');
const {expect} = require('chai');
const {identity} = require('./support/functions');
const {matchMonads} = require('./support/match');
const {Left} = require('../src/left');

describe('Left', function() {
  describe('toString', function() {
    it ('should return Left content', function() {
      expect(
        Left.of(5).toString()
      ).to.eql(
        `Left (5)`
      );
    });
  });

  describe('map', function() {
    it ('should return content value', function() {
      const f = x => 2 * x;
      const m = Left.of(5);

      matchMonads(
        m.map(f),
        m,
      );
    });
  });
});
