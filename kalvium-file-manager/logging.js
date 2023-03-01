const chalk = require('cli-color');

function logGreen(message, func, line) {
  console.log(
    chalk.green(`${message}, function called from: ${func}, line: ${line} `)
  );
}

function logBlue(message, func, line) {
  console.log(
    chalk.blue(`${message}, function called from: ${func}, line: ${line} `)
  );
}

function logRed(message, func, line) {
  console.log(
    chalk.red(`${message}, function called from: ${func}, line: ${line} `)
  );
}

module.exports = { logBlue, logGreen, logRed };
