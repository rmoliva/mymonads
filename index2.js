const Future = require('fluture');
const R = require('ramda');
const M = require('monet');

const multiply = (field, number) => 
    R.over(R.lensProp(field), R.multiply(number));

const run = function(generator, actions) {
    const it = generator();
    const iterate = function(future) {
        var v = it.next();
        if(v.done) {
            // return Future.of(state);
            return future;
        }
        
        // if (typeof v.value === 'string') {
        //     return actions[v.value](state).map(
        //         multiply('x', 3)
        //     ).chain(function(st) {
        //         console.log(st);
        //         return iterate(st)
        //     });
        // }

        let action = actions[v.value];
        return iterate(future.chain(function(st) {
            console.log(st);
            return action(st);
        }));
    };
    return iterate(Future.of({}));
}

function *main1() {
    yield 'init'
    yield 'increment';
    return 'main1';
}

function *main2() {
    yield 'init'
    yield 'increment';
    yield 'wait';
    yield 'decrement';
    return 'main2';
}

const actions = {
    init: (st) => Future.of({ x: 0 }),
    increment: (st) => Future.of(R.over(R.lensProp('x'), R.inc)(st)),
    decrement: (st) => Future.of(R.over(R.lensProp('x'), R.dec)(st)),
    wait: (st) => Future(function computation(reject, resolve){
        //Asynchronous work:
        const x = setTimeout(resolve, 2000, st);
        //Cancellation:
        return () => clearTimeout(x);
    }),
};

Future.parallel(2, [
    // run(main1, actions)
    run(main2, actions),
]).fork(console.error, function(st) {
    console.log("ST");
    console.log(st);
});
