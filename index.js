const { Monad } = require('./src/monad');
const { Either } = require('./src/either');
const { Right } = require('./src/right');
const { Left } = require('./src/left');

const r = Right.of(5);
r.log();

const l = Left.of(15);
l.log();