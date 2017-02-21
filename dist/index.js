'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var babelPolyfill = require('babel-polyfill');
var express = require('express');
var express__default = _interopDefault(express);
var cookieParser = _interopDefault(require('cookie-parser'));
var bodyParser = _interopDefault(require('body-parser'));
var debug = _interopDefault(require('debug'));
var _regeneratorRuntime = _interopDefault(require('babel-runtime/regenerator'));
var _asyncToGenerator = _interopDefault(require('babel-runtime/helpers/asyncToGenerator'));
var _Promise = _interopDefault(require('babel-runtime/core-js/promise'));
var _classCallCheck = _interopDefault(require('babel-runtime/helpers/classCallCheck'));
var _createClass = _interopDefault(require('babel-runtime/helpers/createClass'));
var ssh2 = require('ssh2');
var _JSON$stringify = _interopDefault(require('babel-runtime/core-js/json/stringify'));

// debug
var error = debug('lb-api:error');
var info = debug('lb-api:info');

var sshOptions = {
  host: process.env.LB_SSH_HOST,
  port: process.env.LB_SSH_PORT || 22,
  username: process.env.LB_SSH_USER,
  password: process.env.LB_SSH_PASS,
  algorithms: {
    cipher: ['aes128-cbc']
  }
};
var port = process.env.PORT || 3000;
var host = process.env.WEBSITE_HOSTNAME || 'localhost:' + port;
var cookieKey = process.env.COOKIE_KEY || 'my cookie key';

var CommandHandler = function () {
  function CommandHandler(cmd, handler) {
    _classCallCheck(this, CommandHandler);

    this.command = cmd;
    if (handler) this.handle = handler;
  }

  _createClass(CommandHandler, [{
    key: "handle",
    value: function handle() {
      return null;
    }
  }]);

  return CommandHandler;
}();

/*
命令执行结果示例：
<Sysname> display cpu-usage
Slot 1 CPU 0 CPU usage:
       6% in last 5 seconds
      10% in last 1 minute
       5% in last 5 minutes

Slot 2 CPU 0 CPU usage:
       15% in last 5 seconds
       8% in last 1 minute
       25% in last 5 minutes
 */
var parseCpuInfo = function parseCpuInfo(data) {
  var reg = /Slot (\d) CPU (\d).+:\r*\n\s+(\d+)%.+5 seconds\r*\n\s+(\d+)%.+1 minute\r*\n\s+(\d+)%.+5 minutes/gm;
  var result = reg.exec(data);
  return {
    slot: parseInt(result[1], 10),
    number: parseInt(result[2], 10),
    usage: {
      last5s: parseInt(result[3], 10) / 100,
      last1m: parseInt(result[4], 10) / 100,
      last5m: parseInt(result[5], 10) / 100
    }
  };
};

var cpuUsage$1 = new CommandHandler('display cpu-usage', function (data) {
  info('Text for test:', _JSON$stringify(data));
  var result = {};
  var slotTexts = data.match(/Slot \d CPU \d CPU.+\r*\n(.*\r*\n){2}.*last 5 minutes/gm);
  info('SlotTexts =', slotTexts);
  result.cpus = slotTexts.map(function (text) {
    return parseCpuInfo(text);
  });
  return result;
});

/*
命令执行结果示例：
<Sysname> display memory
The statistics about memory is measured in KB:
Slot 0:
             Total      Used      Free    Shared   Buffers    Cached   FreeRatio
Mem:        507980    154896    353084         0       488     54488       69.5%
-/+ Buffers/Cache:     99920    408060
Swap:           0         0         0
 */

// 目前仅支持单slot
var memory$1 = new CommandHandler('display memory', function (data) {
  info('Text for test:', _JSON$stringify(data));
  var reg = /Slot (\d+):.*\r*\n.+\r*\n\s*Mem\D+(\d+)\s+(\d+)\s+(\d+)/gm;
  var result = reg.exec(data);
  return {
    slot: parseInt(result[1], 10),
    memory: {
      total: parseInt(result[2], 10),
      used: parseInt(result[3], 10),
      free: parseInt(result[4], 10)
    }
  };
});

var handlers = {
  cpuUsage: cpuUsage$1,
  memory: memory$1
};

var info$1 = debug('lb-api:info');

var DeviceManager = function () {
  function DeviceManager(sshOptions) {
    _classCallCheck(this, DeviceManager);

    this.sshOptions = sshOptions;
  }

  /*
  登录ssh，并执行命令
   */


  _createClass(DeviceManager, [{
    key: 'run',
    value: function run(commandHandler) {
      var _this = this;

      var conn = new ssh2.Client();
      return new _Promise(function (resolve, reject) {
        conn.on('ready', function () {
          info$1('Client :: ready');
          var str = '';
          conn.shell(function (err, stream) {
            if (err) reject(err);
            stream.on('close', function () {
              conn.end();
            }).on('data', function (data) {
              str += data;
            }).stderr.on('data', function (data) {
              reject(data);
            }).on('end', function () {
              var result = commandHandler.handle(str);
              resolve(result);
            });
            stream.write('screen-length disable\n');
            stream.write(commandHandler.command + '\n');
            stream.end('exit\n');
          });
        }).connect(_this.sshOptions);
      });
    }
  }, {
    key: 'cpuUsage',
    value: function cpuUsage() {
      return this.run(handlers.cpuUsage);
    }

    /*
    获取内存数据
     */

  }, {
    key: 'memory',
    value: function memory() {
      return this.run(handlers.memory);
    }
  }]);

  return DeviceManager;
}();

var _this = undefined;

/*
 eslint-disable no-param-reassign
*/

var router = new express.Router();

/*
获取当前设备CPU使用信息
 */
router.get('/cpu-usage', function () {
  var _ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee(req, res) {
    var manager, data;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            manager = new DeviceManager(sshOptions);
            _context.next = 3;
            return manager.cpuUsage();

          case 3:
            data = _context.sent;

            res.json({
              ret: 0,
              data: data
            });

          case 5:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, _this);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());

/*
获取当前设备内存使用信息
 */
router.get('/memory', function () {
  var _ref2 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee2(req, res) {
    var manager, data;
    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            manager = new DeviceManager(sshOptions);
            _context2.next = 3;
            return manager.memory();

          case 3:
            data = _context2.sent;

            res.json({
              ret: 0,
              data: data
            });

          case 5:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, _this);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());

var controllers = {
  device: router
};

/**
 * Babel Starter Kit (https://www.kriasoft.com/babel-starter-kit)
 *
 * Copyright © 2015-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

var app = express__default();

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(cookieParser(cookieKey));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

var morgan = require('morgan');
app.use(morgan('dev'));

/*
注册API
*/
app.use('/device', controllers.device);

app.listen(port, function () {
  console.log('The server is running at http://' + host + '/');
});
//# sourceMappingURL=index.js.map
