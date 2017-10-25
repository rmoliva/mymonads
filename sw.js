

const Future = require('fluture');
const R = require('ramda');
const M = require('monet');
const axios = require('axios');

const request = function(url) {
  const getDataResults = R.view(R.lensPath(['data', 'results']));
  return Future(function(reject, resolve) {
    axios.get(url).then(resolve).catch(reject);
  }).map(getDataResults); //.fold(M.Either.Left, M.Either.Right);
};

const requestStarships = request('https://swapi.co/api2/starships');
const requestPlanets = request('https://swapi.co/api/planets');;

const getCost = R.map(R.prop('cost_in_credits'));
const getName = R.map(R.prop('name'));

const setPlanets = (state) => R.set(R.lensProp('planets'), R.__, state);
const setStarships = (state) => R.set(R.lensProp('starships'), R.__, state);

const requestAndSetPlanets = (state) => requestPlanets.map(getName).map(setPlanets(state));
const requestAndSetStarships = (state) => requestStarships.map(getName).map(setStarships(state));

let state = Future.of({}).chain(
  requestAndSetPlanets
).chain(
  requestAndSetStarships
);

// state.fold(M.Either.Left, M.Either.Right).value(console.log);


var state = {
  records: [],
  loading: false,
};

const actions = function(state) {
  return {
    loadRecords: (records)  => R.set(R.lensProp('records'), records, state),
    setLoading: (loading)  => R.set(R.lensProp('loading'), loading, state),    
  }
};

state = M.Just(state).map(function(st) {
  return actions(st).loadRecords([{id: 1, name: 'pepe'}, {id: 2, name: 'juan'}]);
});

console.log(state);


