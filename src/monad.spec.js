const R = require('ramda');
const {expect} = require('chai');
const {Monad} = require('./monad');

const identity = x => x

describe('toString', function() {
  it ('should return Monad content', function() {
    expect(
      Monad(5).toString()
    ).to.eql(
      `Monad (5)`
    );
  });
});
  
describe('Functor', function() {
  it ('u.map(a => a) is equivalent to u (identity)', function() {
    const u = Monad(1);

    console.log(u.toString());

    expect(u.map(a => a).equals(u)).to.be.true;
  });

  it('u.map(x => f(g(x))) is equivalent to u.map(g).map(f) (composition)', function() {
    const f = (x) => x * 2;
    const g = (x) => x + 2;
  
    expect(      
      Monad(1).map(x => f(g(x))).equals(Monad(1).map(g).map(f))
    ).to.be.true;
  });
});

describe('Fantasy Land', function() {
  describe('Apply', function() {
    // v.ap(u.ap(a.map(f => g => x => f(g(x))))) is equivalent to v.ap(u).ap(a) (composition)
    it ('v.ap(u.ap(a.map(f => g => x => f(g(x))))) is equivalent to v.ap(u).ap(a) (composition)', function() {
      const v = Monad(5);
      const u = Monad((x) => x * 2);
      const a = Monad((x) => x / 2);
      
      expect(
        v.apFL(u.apFL(a.map(f => g => x => f(g(x))))).equals(v.apFL(u).apFL(a))
      ).to.be.true;
    });
  });


  describe('Applicative', function() {
    // v.ap(A.of(x => x)) is equivalent to v (identity)
    it ('v.ap(A.of(x => x)) is equivalent to v (identity)', function() {
      const f = Monad(x => x);
      const v = Monad(5);
      expect(v.apFL(f).equals(v)).to.be.true;
    });

    // A.of(x).ap(A.of(f)) is equivalent to A.of(f(x)) (homomorphism)
    it ('A.of(f).ap(A.of(x)) == A.of(f(x)) (homomorphism)', function() {
      const f = (x) => x * 2;
      expect(
        Monad(2).apFL(Monad(f)).equals(
          Monad(f(2))
        )
      ).to.be.true;
    });

    // A.of(y).ap(u) is equivalent to u.ap(A.of(f => f(y))) (interchange)
    it ('A.of(y).ap(u) is equivalent to u.ap(A.of(f => f(y))) (interchange)', function() {
      const y = 3;
      const u = Monad(x => x * 2);
      
      expect(
        Monad(y).apFL(u).equals(
          u.apFL(Monad(f => f(y)))
        )
      ).to.be.true;    
    });
  });
});

describe('Adequate guide', function() {
  describe('Applicative', function() {
    // A.of(id).ap(v) == v (identity)
    it ('A.of(id).ap(v) == v (identity)', function() {
      const v = Monad(5);

      expect(
        Monad(x => x).ap(v).equals(v)
      ).to.be.true;
    });

    // A.of(f).ap(A.of(x)) == A.of(f(x)) (homomorphism)
    it ('A.of(f).ap(A.of(x)) == A.of(f(x)) (homomorphism)', function() {
      const f = x => x * 2;
      const x = 5;
      expect(
        Monad(f).ap(Monad(x)).equals(Monad(f(x)))
      ).to.be.true;
    });

    // v.ap(A.of(x)) == A.of(function(f) { return f(x) }).ap(v) (interchange)
    it ('v.ap(A.of(x)) == A.of(function(f) { return f(x) }).ap(v) (interchange)', function() {
      const v = Monad(x => x * 2);
      const x = 5;

      expect(
        v.ap(Monad(x)).equals(Monad(f => f(x)).ap(v))
      ).to.be.true;    
    });

    // A.of(compose).ap(u).ap(v).ap(w) == u.ap(v.ap(w)) (composition)
    it.only ('A.of(compose).ap(u).ap(v).ap(w) == u.ap(v.ap(w)) (composition)', function() {
      const m = Monad.of(identity);
      const a = m.map(R.compose).ap(m).ap(m)
      const b = m.ap(m.ap(m))      
      const j = Monad.of(3)

      expect(
        a.ap(j).equals(b.ap(j))
      ).to.be.true;
    });

    it ('F.of(x).map(f) == F.of(f).ap(F.of(x))', function() {
      const v = 5;
      const f = x => x * 2;

      expect(
        Monad(v).map(f).equals(Monad(f).ap(Monad(v)))
      ).to.be.true;      
    });
  });
});


