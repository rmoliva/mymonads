const { Utils } = require('./utils');
const { Right } = require('./right');

const Either = {
  of: function(value) {
    return Right.of(value);
  },
};

module.exports = { Either };