const R = require('ramda');
const {expect} = require('chai');
const {identity} = require('./support/functions');
const {matchMonads} = require('./support/match');
const {Monad} = require('../src/monad');

describe('Monad', function() {
  describe('toString', function() {
    it ('should return Monad content', function() {
      expect(
        Monad.of(5).toString()
      ).to.eql(
        `Monad (5)`
      );
    });
  });

  describe('Functor', function() {
    it ('u.map(a => a) is equivalent to u (identity)', function() {
      const u = Monad.of(1);

      matchMonads(
        u.map(identity),
        u
      )
    });

    it('u.map(x => f(g(x))) is equivalent to u.map(g).map(f) (composition)', function() {
      const f = (x) => x * 2;
      const g = (x) => x + 2;

      matchMonads(
        Monad.of(1).map(x => f(g(x))),
        Monad.of(1).map(g).map(f),
      );
    });
  });

  describe('Fantasy Land', function() {
    describe('Apply', function() {
      // v.ap(u.ap(a.map(f => g => x => f(g(x))))) is equivalent to v.ap(u).ap(a) (composition)
      it ('v.ap(u.ap(a.map(f => g => x => f(g(x))))) is equivalent to v.ap(u).ap(a) (composition)', function() {
        const v = Monad.of(5);
        const u = Monad.of((x) => x * 2);
        const a = Monad.of((x) => x / 2);

        matchMonads(
          v.apFL(u.apFL(a.map(f => g => x => f(g(x))))),
          v.apFL(u).apFL(a)
        );
      });
    });

    describe('Applicative', function() {
      // v.ap(A.of(x => x)) is equivalent to v (identity)
      it ('v.ap(A.of(x => x)) is equivalent to v (identity)', function() {
        const f = Monad.of(x => x);
        const v = Monad.of(5);
        matchMonads(
          v.apFL(f),
          v
        );
      });

      // A.of(x).ap(A.of(f)) is equivalent to A.of(f(x)) (homomorphism)
      it ('A.of(f).ap(A.of(x)) == A.of(f(x)) (homomorphism)', function() {
        const f = (x) => x * 2;
        matchMonads(
          Monad.of(2).apFL(Monad.of(f)),
          Monad.of(f(2))
        );
      });

      // A.of(y).ap(u) is equivalent to u.ap(A.of(f => f(y))) (interchange)
      it ('A.of(y).ap(u) is equivalent to u.ap(A.of(f => f(y))) (interchange)', function() {
        const y = 3;
        const u = Monad.of(x => x * 2);

        matchMonads(
          Monad.of(y).apFL(u),
          u.apFL(Monad.of(f => f(y))),
        );
      });
    });
  });

  describe('Adequate guide', function() {
    describe('Applicative', function() {
      // A.of(id).ap(v) == v (identity)
      it ('A.of(id).ap(v) == v (identity)', function() {
        const v = Monad.of(5);

        matchMonads(
          Monad.of(x => x).ap(v),
          v
        );
      });

      // A.of(f).ap(A.of(x)) == A.of(f(x)) (homomorphism)
      it ('A.of(f).ap(A.of(x)) == A.of(f(x)) (homomorphism)', function() {
        const f = x => x * 2;
        const x = 5;
        matchMonads(
          Monad.of(f).ap(Monad.of(x)),
          Monad.of(f(x))
        );
      });

      // v.ap(A.of(x)) == A.of(function(f) { return f(x) }).ap(v) (interchange)
      it ('v.ap(A.of(x)) == A.of(function(f) { return f(x) }).ap(v) (interchange)', function() {
        const v = Monad.of(x => x * 2);
        const x = 5;

        matchMonads(
          v.ap(Monad.of(x)),
          Monad.of(f => f(x)).ap(v)
        );
      });

      // A.of(compose).ap(u).ap(v).ap(w) == u.ap(v.ap(w)) (composition)
      it ('A.of(compose).ap(u).ap(v).ap(w) == u.ap(v.ap(w)) (composition)', function() {
        const m = Monad.of(identity);
        const a = m.map(R.compose).ap(m).ap(m)
        const b = m.ap(m.ap(m))
        const j = Monad.of(3)

        matchMonads(
          a.ap(j),
          b.ap(j),
        );
      });

      it ('F.of(x).map(f) == F.of(f).ap(F.of(x))', function() {
        const v = 5;
        const f = x => x * 2;

        matchMonads(
          Monad.of(v).map(f),
          Monad.of(f).ap(Monad.of(v)),
        );
      });
    });
  });

  describe('Chain', function() {
    // m.chain(f).chain(g) is equivalent to m.chain(x => f(x).chain(g)) (associativity)
    it ('m.chain(f).chain(g) is equivalent to m.chain(x => f(x).chain(g)) (associativity)', function(){
      const f = x => Monad.of(x * 2);
      const g = x => Monad.of(x / 2);
      const m = Monad.of(5);

      matchMonads(
        m.chain(f).chain(g),
        m.chain(x => f(x).chain(g)),
      );
    });
  });
});
