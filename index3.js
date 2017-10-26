
const Promise = require('bluebird');
const R = require('ramda');


const testpr = function(timeout, value) {
    return function() {
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                console.log(`PR: ${timeout}, ${value}`)
                resolve(value);
            }, timeout);
        });
    }
}

const generator = function *(pr, data) {
    for(let i = 0; i < data.length; i++) {
        yield (pr(data[i].time, data[i].value));                     
    }
};

const s = function(g, promise, d) {
    let p = Promise.resolve();
    p = p.then(g.next().value);
    p = p.then(g.next().value);
    p = p.then(g.next().value);
    p = p.then(g.next().value);


    // for(let v of generator(promise, d)) {
    //     console.log(v);
    //     p = p.then(v);
    // }
    return p;
}

const data = [{
    time: 1000,
    value: 17
}, {
    time: 500,
    value: 54
}, {
    time: 2000,
    value: 89
}, {
    time: 200,
    value: 134
}, {
    time: 100,
    value: 89
}];


let gen  = generator(testpr, data);

s(gen, testpr, data).then(function() {

    console.log('Terminado automatico')

    return gen.next().value();
});



// testpr(1000, 17)
