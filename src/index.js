/**
 * Babel Starter Kit (https://www.kriasoft.com/babel-starter-kit)
 *
 * Copyright © 2015-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import 'babel-polyfill';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { host, port, cookieKey } from './config';
import controllers from './controllers/index';

const app = express();

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(cookieParser(cookieKey));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

/*
注册API
*/
app.use('/device', controllers.device);
app.use('/interface', controllers.ni);
app.use('/server-lb', controllers.serverLb);

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.json({
      ret: 401,
      msg: err.message,
    });
  } else {
    res.json({
      ret: 500,
      msg: err.message,
    });
  }
});
app.listen(port, () => {
  console.log(`The server is running at http://${host}/`);
});
