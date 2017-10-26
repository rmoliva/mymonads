const { Utils } = require('./utils');
const { MonadDef } = require('./monad');

const LeftDef = function(value) {
  const _class = Left;
  const _className = 'Left';

  /// Functor
  // u.map(a => a) is equivalent to u (identity)
  // u.map(x => f(g(x))) is equivalent to u.map(g).map(f) (composition)
  const _map = function(fn) {
    return this;
  };

  let def = {
    _class,
    _className,
    map: _map,
  };
  return Object.assign({}, MonadDef(value), def);
};

const Left = {
  of: function(value) {
    return Object.create(LeftDef(value));
  },
};

module.exports = { Left, LeftDef };
