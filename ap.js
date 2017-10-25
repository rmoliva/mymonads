const R = require('ramda');
const RA = require('ramda-adjunct');
const axios = require('axios');
const flyd = require('flyd');

const {create, env} = require('sanctuary');
const {env: flutureEnv} = require('fluture-sanctuary-types');
const Future = require('fluture');
const S = create({checkTypes: true, env: env.concat(flutureEnv)});

const request = function(url) {
  const getDataResults = R.view(R.lensPath(['data', 'results']));
  return Future(function(reject, resolve) {
    axios.get(url).then(resolve).catch(reject);
  }).map(getDataResults); //.fold(M.Either.Left, M.Either.Right);
};
const requestStarships = request('https://swapi.co/api/starships');
const requestPeople = request('https://swapi.co/api/people');
  
const state = S.of(S.Either, {});
const loading = S.Just(false);
// const setLoading = R.set(R.lensProp('loading'))
// const ioLoading = M.IO(setLoading);
// const setLoading2 = function(l, st) {   
//     console.log('-----------------')    
//     console.log(l)
//     console.log(st)
//     console.log('-----------------')
    
//     return R.set(R.lensProp('loading'), l, st);
// };

// const res1 = R.lift(setLoading(true), [state]);
// const res2 = state.ap(setLoading(true));
// const res3 = state.map(setLoading(true));
// const liftLoading = R.liftN(2, setLoading2);

// console.log(liftLoading);

// const res4 = liftLoading(M.Just(false), state);

// console.log(res1);
// console.log(res2);
// console.log(res3);
// console.log(res4);

// const f = R.curry(function(l, st) {
//     console.log('-------------------');
//     console.log(l);
//     console.log(st);
//     console.log('-------------------');
//     return R.set(R.lensProp('loading'), l, st);
// });

const f = (field) => R.set(R.lensProp(field));
const f2 = function(field, l, state) {
  return f(field)(R.map(R.prop('name'), l), state);
};

// let res2 = S.lift2(f('loading'), S.Just(false), S.Just({}));
// console.log(res2);
// res2 = S.lift2(f('loading'), S.Just(true), res2);
// console.log(res2);

// let res3 = S.lift2(f2('starships'), requestStarships, Future.of({}));
// res3 = S.lift2(f2('people'), requestPeople, res3);

// console.log('----------------------');
// res3.fork(console.error, console.log);

const f3 = RA.liftFN(2, R.curry(f2));

let res4 = f3(Future.of('starships'), requestStarships, Future.of({}));
res4 = f3(Future.of('people'), requestPeople, res4);

console.log('2----------------------');
res4.fork(console.error, console.log);
