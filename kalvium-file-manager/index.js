// run `node index.js` in the terminal

//Include the fs module
const fs = require('fs');
const { logBlue, logGreen, logRed } = require('./logging.js');

Object.defineProperty(global, '__stack', {
  get: function () {
    var orig = Error.prepareStackTrace;
    Error.prepareStackTrace = function (_, stack) {
      return stack;
    };
    var err = new Error();
    Error.captureStackTrace(err, arguments.callee);
    var stack = err.stack;
    Error.prepareStackTrace = orig;
    return stack;
  },
});

Object.defineProperty(global, '__line', {
  get: function () {
    return __stack[1].getLineNumber();
  },
});

Object.defineProperty(global, '__function', {
  get: function () {
    return __stack[1].getFunctionName();
  },
});

var dataAsync = '';
var dataSync = '';

function readFileSync(filePath) {
  const data = fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' });
  logGreen(
    `[Internal] Data read syncrhonously completed ${data}`,
    __function,
    __line
  );
  return data;
}

function readFileAysncPromiseWrapped(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(
      filePath,
      { encoding: 'utf8', flag: 'r' },
      function (err, data) {
        if (err) {
          logRed('[Internal] Error while reading the data', __function, __line);
          reject(err);
        } else {
          logGreen(
            `[Internal] Data read asynchronously completed ${data}`,
            __function,
            __line
          );
          resolve(data);
        }
      }
    );
  });
}

function readFileAsync(filePath) {
  fs.readFile(filePath, { encoding: 'utf8', flag: 'r' }, function (err, data) {
    if (err) {
      logRed('[Internal] Error while reading the data', __function, __line);
    } else {
      logGreen(
        `[Internal] Data read asynchronously completed ${data}`,
        __function,
        __line
      );
      dataAsync = data;
    }
  });
}

function writeFileSync(filePath, data) {
  try {
    fs.writeFileSync(filePath, data, { encoding: 'utf8', flag: 'w' });
    logBlue(
      '[Internal] Synchronous write to the file completed',
      __function,
      __line
    );
  } catch (err) {
    logRed(
      `[Internal] Failed while writing the file sync ${toString(err)}`,
      __function,
      __line
    );
  }
}

function writeFileAsync(filePath, data) {
  fs.writeFile(
    filePath,
    data,
    { encoding: 'utf8', flag: 'w' },
    function (err, data) {
      if (err) {
        logRed(
          `[Internal] Failed while writing the file async ${toString(err)}`,
          __function,
          __line
        );
      } else {
        logBlue(
          '[Internal] Asynchronous write to the file completed',
          __function,
          __line
        );
      }
    }
  );
}

function readWriteSync() {
  console.log(
    '-------------------------------------- Starting read write sync --------------------------------------'
  );
  dataSync = readFileSync('./KFM-source/input.txt');
  writeFileSync('./KFM-destination/output.txt', dataSync);
  console.log(
    '-------------------------------------- Finishing read write sync --------------------------------------'
  );
}

function readSyncWriteAsync() {
  console.log(
    '-------------------------------------- Starting read sync write async --------------------------------------'
  );
  dataSync = readFileSync('./KFM-source/input2.txt');
  writeFileAsync('./KFM-destination/output2.txt', dataAsync);
  console.log(
    '-------------------------------------- Finishing read sync write async --------------------------------------'
  );
}

function readWriteAsync() {
  console.log(
    '-------------------------------------- Starting read write async --------------------------------------'
  );
  readFileAysncPromiseWrapped('./KFM-source/input2.txt')
    .then((dataAsync) => {
      writeFileAsync('./KFM-destination/output2.txt', dataAsync);
    })
    .catch((err) => {
      console.log('Failed while reading async');
    });
  console.log(
    '-------------------------------------- Finishing read write async --------------------------------------'
  );
}

function readAsyncWriteSync() {
  console.log(
    '-------------------------------------- Starting read async write sync --------------------------------------'
  );
  readFileAysncPromiseWrapped('./KFM-source/input.txt')
    .then((dataAsync) => {
      writeFileSync('./KFM-destination/output.txt', dataAsync);
    })
    .catch((err) => {
      console.log('Failed while reading async');
    });
  console.log(
    '-------------------------------------- Finishing read async write sync --------------------------------------'
  );
}

//------------------------------------------------------------------------
// Combinations
readWriteSync();
readSyncWriteAsync();
readWriteAsync();
readAsyncWriteSync();

//------------------------------------------------------------------------
// Combinations end here

// //Individual calls
// readFileAsync("./KFM-source/input2.txt");
// dataSync = readFileSync("./KFM-source/input.txt");

// writeFileSync("./KFM-destination/output.txt", dataSync);
// writeFileAsync("./KFM-destination/output2.txt", dataAsync);console.log(`Hello Node.js v${process.versions.node}!`);
