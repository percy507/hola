const chalk = require('chalk');
const clog = console.log;

const INFO_COLOR = '#5C6270';
const SUCCESS_COLOR = '#67C23A';
const WARNING_COLOR = '#E6A23C';
const ERROR_COLOR = '#F56C6C';

const log = {
  info(msg) {
    clog(chalk.hex(INFO_COLOR)(msg));
  },
  success(msg) {
    clog(chalk.hex(SUCCESS_COLOR)(msg));
  },

  warning(msg) {
    clog(chalk.hex(WARNING_COLOR)(msg));
  },

  error(msg) {
    clog(chalk.hex(ERROR_COLOR)(msg));
  }
};

module.exports = log;
