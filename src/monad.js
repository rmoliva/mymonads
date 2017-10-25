const R = require('ramda');

const Utils = {
  equals: function(other) {
    return R.equals(other._value, this._value);
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
    console.log('S: MAP---------------')
    this.log('this')
    console.log(fn.toString());
    let ret =  Monad(fn(this._value));
    ret.log('ret')
    console.log('E: MAP---------------')
    return ret;
  };

  /// Apply Fantasy Land
  // v.ap(A.of(x => x)) is equivalent to v (identity)
  // A.of(x).ap(A.of(f)) is equivalent to A.of(f(x)) (homomorphism)
  // A.of(y).ap(u) is equivalent to u.ap(A.of(f => f(y))) (interchange)
  const _apFL = function(applyWithFunction) {
    const value = this._value;
    return applyWithFunction.map(fn => fn(value));
  };

  // Applicative Mostly Adequate
  // A.of(id).ap(v) == v (identity)
  const _ap = function(m) {
    const value = this._value;
    console.log('S: AP---------------')
    this.log('this')
    m.log('m')
    
    if(typeof value !== "function") {
      throw new TypeError(`${this._className}.ap: Wrapped value must be a function`)
    }
    
    if(!this.isSameType(m)) {
      throw new TypeError(`${this._className}.ap: ${this._className} required (${m._className})`)
    }

    const ret =  m.map(value);
    ret.log('ret')
    console.log('E: AP---------------')    
    return ret;
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

// const u = Monad.of(R.toUpper);
// const v = Monad.of(R.concat(" & beyond"));
// const w = Monad.of(R.always("blood bath "));

// const ret1 = u.ap(v).ap(w);
// ret1.inspect('RET1');

const constant = x => () => x
const identity = x => x

const m = Monad.of(identity);
const a = m.map(R.compose).ap(m).ap(m)
const b = m.ap(m.ap(m))

const j = Monad.of(3)

const ret1 = a.ap(j)
ret1.log('RET1');

console.log('-------------------------');
console.log('-------------------------');
console.log('-------------------------');
console.log('-------------------------');
const ret2 = b.ap(j)
ret2.log('RET2');

// const ret2 = Monad.of(R.compose).ap(u).ap(v).ap(w)
// ret2.log('RET2');


// const fu = R.toUpper;
// const fv = R.concat('Hasta el infinto');

// // const a = Monad(3);
// const st = ' y mas alla';
// const u = Monad(fu);
// const v = Monad(fv);
// const a = Monad(st);

// console.log('1*******');

// console.log(
//   fu(fv)
// );

// console.log(
//   R.compose(fu,fv)
// );
// console.log('2*******');

// console.log(
//   Monad(5).ap(u).ap(v).toString()
// );

// console.log('3*******');
// console.log(fu(fv(st)));

// console.log(
//   a.ap(v.ap(u.map(f => g => x => f(g(x))))).toString()
// );

// console.log(
//   a.ap(v).ap(u).toString()
// );


// const y = Monad(x => y => x * y);
// const u = Monad(x => x * 2);
// const v = Monad(x => x + 2);

// console.log(
//   Monad(5).apFL(v).apFL(u).toString()
// );

// var liftA2 = R.curry(function(f, functor1, functor2) {
//   return functor1.map(f).apFL(functor2);
// });

// console.log('4*******');

// console.log(
//   liftA2(R.add, Monad(3), Monad(5)).toString()
// );

// console.log(
//   u.ap(Monad(f => f(y))).toString()
// );

// console.log('4*******');

// console.log(
//   Monad(fv).ap(Monad(fu)).ap(Monad(3))
// );

// console.log(
//   Monad(2).map(fu).equals(Monad(fu).ap(Monad(2)))
// );

// console.log(
//   u.ap(Monad(5)).toString()
// );


// const m2 = Monad.of(2).map(x => y => x + y)
// console.log(m2);
// console.log('--------------------')
// const m3 = m2.ap(Monad.of(4))
// console.log('--------------------')
// console.log(m3);


// console.log(Monad.of(10));
// const m = Monad.of(5).map(x => x * 2);
// console.log(m);



/// Applicative
// v.ap(A.of(x => x)) is equivalent to v (identity)
// A.of(x).ap(A.of(f)) is equivalent to A.of(f(x)) (homomorphism)
// A.of(y).ap(u) is equivalent to u.ap(A.of(f => f(y))) (interchange)

module.exports = { Monad };