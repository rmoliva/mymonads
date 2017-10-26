const { Utils } = require('./utils');

const MonadDef = function(value) {
  const _class = Monad;
  const _className = 'Monad';

  const _mustBeFunction = function(f, caller, message) {
    if(typeof f !== "function") {
      throw new TypeError(`${this._className}.${caller}: ${message}`)
    }
  }

  const _mustBeSameType = function(m, caller, message) {
    if(!this.isSameType(m)) {
      throw new TypeError(`${this._className}.${caller}: ${message}`)
    }
  }

  /// Functor
  // u.map(a => a) is equivalent to u (identity)
  // u.map(x => f(g(x))) is equivalent to u.map(g).map(f) (composition)
  const _map = function(fn) {
    return this._class.of(fn(this._value));
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
    const value = this._value;
    _mustBeFunction.call(this, value, 'ap', `Wrapped value must be a function`);
    _mustBeSameType.call(this, m, 'ap', `${this._className} required (${m._className})`);
    return  m.map(this._value);
  };

  const _join = function() {
    return this._value;
  };

  const _chain = function(f) {
    _mustBeFunction.call(this, f, 'chain', `Passed value must be a function`);
    const m = this.map(f).join();
    _mustBeSameType.call(this, m, 'chain', `${this._className} required (${m._className})`);
    return m;
  };

  let def = {
    _value: value,
    _class,
    _className,
    apFL: _apFL,
    ap: _ap,
    join: _join,
    map: _map,
    chain: _chain,
  };
  return Object.assign({}, Utils, def)
};

const Monad = {
  of: function(value) {
    return Object.create(MonadDef(value));
  },
};

module.exports = { Monad, MonadDef };

// https://livebook.manning.com/#!/book/functional-programming-in-javascript/chapter-5/260
// // Function lifting

// const safeFindObject = R.curry(function(db, id) {
//   return Maybe.fromNullable(find(db, id));
// });

// // Previous is the same as:

// const lift = R.curry(function (f, value) {
//   return Maybe.fromNullable(value).map(f);
// });

// const findObject = R.curry(function(db, id) {
//   return find(db, id);
// });

// const safeFindObject = R.compose(lift, findObject);
// safeFindObject(DB('student'), '444-44-4444');