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

const Monad = function(value) {
  const _className = 'Monad';

  /// Functor
  // u.map(a => a) is equivalent to u (identity)
  // u.map(x => f(g(x))) is equivalent to u.map(g).map(f) (composition)
  const _map = function(fn) {
    return Monad(fn(this._value));
  };

  /// Apply Fantasy Land
  // v.ap(A.of(x => x)) is equivalent to v (identity)
  // A.of(x).ap(A.of(f)) is equivalent to A.of(f(x)) (homomorphism)
  // A.of(y).ap(u) is equivalent to u.ap(A.of(f => f(y))) (interchange)
  const _apFL = function(m) {
    const value = this._value;
    return m.map(fn => fn(value));
  };

  // Applicative Mostly Adequate
  // A.of(id).ap(v) == v (identity)
  const _ap = function(m) {
    if(typeof value !== "function") {
      throw new TypeError(`${this._className}.ap: Wrapped value must be a function`)
    }
    
    if(!this.isSameType(m)) {
      throw new TypeError(`${this._className}.ap: ${this._className} required (${m._className})`)
    }
    return  m.map(this._value);
  };
  
  let def = {
    _value: value,
    _className,
    apFL: _apFL,
    ap: _ap,
    map: _map,
  };
  def = Object.assign({}, def, Utils);
  return Object.create(def);
};

Monad.of = function(value) {
  return Monad(value);
}

module.exports = { Monad };