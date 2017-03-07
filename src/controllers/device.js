/*
 eslint-disable no-param-reassign
*/

import { Router } from 'express';
import expressJwt from 'express-jwt';
import DeviceManager from '../models/device-manager';
import { sshOptions, info, secret } from '../config';
import { getToken, sendRequestToQueue } from '../utils';

const router = new Router();

const expressJwtOptions = {
  secret,
  credentialsRequired: true,
  getToken,
};
/*
获取当前设备CPU使用信息
 */
router.get('/cpu-usage',
  expressJwt(expressJwtOptions),
  sendRequestToQueue(),
  async (req, res) => {
    const manager = new DeviceManager(sshOptions);
    const data = await manager.cpuUsage();
    res.json({
      ret: 0,
      data,
    });
  }
);

/*
获取当前设备内存使用信息
 */
router.get('/memory',
  expressJwt(expressJwtOptions),
  sendRequestToQueue(),
  async (req, res) => {
    const manager = new DeviceManager(sshOptions);
    const data = await manager.memory();
    res.json({
      ret: 0,
      data,
    });
  }
);

/*
获取当前设备风扇状态
 */
router.get('/fan',
  expressJwt(expressJwtOptions),
  sendRequestToQueue(),
  async (req, res) => {
    const manager = new DeviceManager(sshOptions);
    const data = await manager.fan();
    res.json({
      ret: 0,
      data,
    });
  }
);

/*
获取当前设备电源信息
 */
router.get('/power',
  expressJwt(expressJwtOptions),
  sendRequestToQueue(),
  async (req, res) => {
    const manager = new DeviceManager(sshOptions);
    const data = await manager.power();
    res.json({
      ret: 0,
      data,
    });
  }
);

/*
获取当前设备环境信息
 */
router.get('/environment',
  expressJwt(expressJwtOptions),
  sendRequestToQueue(),
  async (req, res) => {
    const manager = new DeviceManager(sshOptions);
    const data = await manager.environment();
    res.json({
      ret: 0,
      data,
    });
  }
);

export default router;
