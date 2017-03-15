/*
 eslint-disable no-param-reassign
*/

import { Router } from 'express';
import expressJwt from 'express-jwt';
import ServerLbManager from '../models/server-lb-manager';
import { sshOptions, info, secret } from '../config';
import { getToken, sendRequestToQueue } from '../utils';

const router = new Router();

const expressJwtOptions = {
  secret,
  credentialsRequired: true,
  getToken,
};


router.get('/virtual-server',
  expressJwt(expressJwtOptions),
  sendRequestToQueue(),
  async (req, res) => {
    const manager = new ServerLbManager(sshOptions);
    const data = await manager.virtualServers();
    res.json({
      ret: 0,
      data,
    });
  }
);

router.get('/server-farm',
  expressJwt(expressJwtOptions),
  sendRequestToQueue(),
  async (req, res) => {
    const manager = new ServerLbManager(sshOptions);
    const data = await manager.serverFarms();
    res.json({
      ret: 0,
      data,
    });
  }
);

router.get('/real-server',
  expressJwt(expressJwtOptions),
  sendRequestToQueue(),
  async (req, res) => {
    const manager = new ServerLbManager(sshOptions);
    const data = await manager.realServers();
    res.json({
      ret: 0,
      data,
    });
  }
);

router.get('/lb-policy',
  expressJwt(expressJwtOptions),
  sendRequestToQueue(),
  async (req, res) => {
    const manager = new ServerLbManager(sshOptions);
    const data = await manager.lbPolicy();
    res.json({
      ret: 0,
      data,
    });
  }
);
export default router;
