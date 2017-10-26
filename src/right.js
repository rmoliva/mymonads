const { Utils } = require('./utils');
const { MonadDef } = require('./monad');

const RightDef = function(value) {
  const _class = Right;
  const _className = 'Right';

  let def = {
    _class,
    _className,
  };

  return Object.assign({}, MonadDef(value), def);
};

const Right = {
  of: function(value) {
    return Object.create(RightDef(value));
  },
};

module.exports = { Right, RightDef };
