/*
 eslint-disable no-param-reassign
*/

import { Router } from 'express';
import expressJwt from 'express-jwt';
import InterfaceManager from '../models/interface-manager';
import { sshOptions, info, secret } from '../config';
import { getToken } from '../utils';

const router = new Router();

const expressJwtOptions = {
  secret,
  credentialsRequired: true,
  getToken,
};

router.get('/',
  expressJwt(expressJwtOptions),
  async (req, res) => {
    const manager = new InterfaceManager(sshOptions);
    const data = await manager.brief();
    res.json({
      ret: 0,
      data,
    });
  }
);

router.get('/counters/inbound',
  expressJwt(expressJwtOptions),
  async(req, res) => {
    const manager = new InterfaceManager(sshOptions);
    const data = await manager.inboundCounters();
    res.json({
      ret: 0,
      data,
    });
  }
);

router.get('/counters/outbound',
  expressJwt(expressJwtOptions),
  async(req, res) => {
    const manager = new InterfaceManager(sshOptions);
    const data = await manager.outboundCounters();
    res.json({
      ret: 0,
      data,
    });
  }
);

export default router;
