const R = require('ramda');

const Utils = {
  equals: function(other) {
    return this.isSameType(other) && R.equals(other._value, this._value);
  },
  toString: function() {
    return `${this._className} (${this._value})`;
  },
  inspect: function(label) {
    return `- ${label} : ${this.toString()}`;
  },
  log: function(label) {
    console.log(this.inspect(label));
  },
  isSameType: function(other) {
    return this._className === other._className
  },
};

module.exports = {Utils};
