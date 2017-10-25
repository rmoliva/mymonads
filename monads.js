
const Future = require('fluture');
const R = require('ramda');
const M = require('monet');
const axios = require('axios');
const flyd = require('flyd');

const request = function(url) {
  const getDataResults = R.view(R.lensPath(['data', 'results']));
  return Future(function(reject, resolve) {
    axios.get(url).then(resolve).catch(reject);
  }).map(getDataResults); //.fold(M.Either.Left, M.Either.Right);
};
  
const requestStarships = request('https://swapi.co/api/starships');

const setRecords = (state) => R.set(R.lensProp('records'), R.__, state);

const inspect = (label) => {
  return (x) => {
    console.log(label);
    console.log(x);
    return x;
  }
};

const actions = function() {
  return {
    loadRecords: () => (state) => requestStarships.map(
        R.map(R.pick(['name', 'model']))        
      ).map(
        setRecords(state)
      ),
    setLoading: (loading) => (state) =>
      // return M.IO(R.set(R.lensProp('loading'), loading));
      Future(function(reject, resolve) {
        resolve(
          R.set(R.lensProp('loading'), loading, state)
        );
      }),
      refresh: (stream$) => (state) => Future(function(reject, resolve) {
        stream$(state);
        resolve(state);
      }),
  }
};

const refresh = function(stream$, state) {
  return Future(function(reject, resolve) {
    stream$(state);
    resolve(state);
  });
}

function doM(generator, actions, state, stream$) {
  let gen = generator(actions, stream$);
  function step(functor) {
      var result = gen.next();
      if (result.done) {
          return functor;
      }
      return step(functor.chain(result.value));
  }
  return step(Future.of(state));
}

const viewFn = function(state) {
  
  console.log('Draw the view:');
  console.log(state);    
};

const performTransition = function(generator, initial_state) {
  let stream$ = flyd.stream();
  flyd.on(viewFn, stream$);
  return doM(generator, actions(), initial_state, stream$);
};

const reloadTransition = function *(actions, stream$) {
  yield actions.setLoading(true);
  yield actions.refresh(stream$);
  yield actions.loadRecords();
  yield actions.setLoading(false);    
}

performTransition(
  reloadTransition, {
    records: [],
    loading: false,
  }
).fork(R.F, viewFn);

// state = Future.of(state).chain(function(st) {
//   return actions(st).setLoading(true);
// }).chain(function(st) {
//   return actions(st).refresh(state$);
// }).chain(function(st) {
//   return actions(st).loadRecords();
// }).chain(function(st) {
//   return actions(st).setLoading(false);    
// }).chain(function(st) {
//   return actions(st).refresh(state$);
// });

// state.fork(R.F, R.T);

// const gen = function *(st) {
//     yield actions(st).setLoading(true);
//     yield actions(st).refresh(state$);
//     yield actions(st).loadRecords([{id: 1, name: 'pepe'}, {id: 2, name: 'juan'}]);
//     yield actions(st).setLoading(false);    
//     yield actions(st).refresh(state$);
// };




