const fs = require('fs');

console.log("hello");

fs.readFile('./input.txt', function () {
  setTimeout(() => {
    console.log("Inside the set timeout function");
  }, 0);

  setImmediate(() => {
    console.log("Inside the set immediate function");
  });
});

setTimeout(function() {
  console.log('set timeout outside')
},2);


console.log("end");