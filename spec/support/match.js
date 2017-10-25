const {expect} = require('chai');

const matchMonads = function(monad1, monad2) {
  expect(monad1.equals(monad2)).to.be.true;
};

module.exports = {matchMonads};