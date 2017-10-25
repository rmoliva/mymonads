const R = require('ramda');
const M = require('monet');
const Future = require('fluture');

// Exercise 1
// ==========
// Use safeProp and map/join or chain to safely get the street name when given
// a user.
var safeProp = R.curry(function(x, o) {
    return M.Maybe.of(o[x]);
});
var user = {
  id: 2,
  name: 'albert',
  address: {
    street: {
      number: 22,
      name: 'Walnut St',
    },
  },
};

var ex1 = R.compose(R.chain(safeProp('name')), R.chain(safeProp('street')), safeProp('address'));
console.log('Exercise 1');
console.log(ex1(user));

// Exercise 2
// ==========
// Use getFile to get the filename, remove the directory so it's just the file,
// then purely log it.

var getFile = function() {
  return M.IO(function() {
    return __filename;
  });
};

var pureLog = function(x) {
  return M.IO(function() {
    console.log('logged ' + x);
    return 'logged ' + x;
  });
};

var inspect = function(x) {
  console.log(x);
  return x;
};

var basename = function(fullPath) {
  return fullPath.split('\\').pop().split('/').pop();
};

var ex2 = R.compose(R.chain(pureLog), R.map(basename), getFile);
console.log('Exercise 2');
ex2().perform();

// Exercise 3
// ==========
// Use getPost() then pass the post's id to getComments().
//
var getPost = function(i) {
  return Future(function(rej, res) {
    setTimeout(function() {
      res({
        id: i,
        title: 'Love them tasks',
      });
    }, 300);
  });
};

var getComments = function(i) {
  return Future(function(rej, res) {
    setTimeout(function() {
      res([{
        post_id: i,
        body: 'This book should be illegal',
      }, {
        post_id: i,
        body: 'Monads are like smelly shallots',
      }]);
    }, 300);
  });
};

var getID = R.prop('id');
var ex3 = R.compose(R.chain(getComments), R.map(getID), getPost);

console.log('Exercise 3');
ex3(31).fork(console.error, console.log);


// Exercise 4
// ==========
// Use validateEmail, addToMailingList, and emailBlast to implement ex4's type
// signature.

//  addToMailingList :: Email -> IO([Email])
var addToMailingList = (function(list) {
  return function(email) {
    return M.IO(function() {
      list.push(email);
      return list;
    });
  };
})([]);

function emailBlast(list) {
  return M.IO(function() {
    return 'emailed: ' + list.join(',');
  });
}

var validateEmail = function(x) {
  return x.match(/\S+@\S+\.\S+/) ? (M.Either.Right(x)) : (M.Either.Left('invalid email'));
};

//  ex4 :: Email -> Either String (IO String)
// var ex4 = R.compose(R.chain(emailBlast), R.map(addToMailingList), R.map(M.Right), R.map(inspect), validateEmail);
var ex4 = R.compose(R.chain(emailBlast), R.chain(addToMailingList), validateEmail);
var email = 'floyd303@gmail.com';
console.log('Exercise 4');
console.log(ex4(email).perform());
