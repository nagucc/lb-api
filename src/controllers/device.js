/*
 eslint-disable no-param-reassign
*/

import { Router } from 'express';
import DeviceManager from '../models/device-manager';
import { sshOptions, info } from '../config';
const router = new Router();

/*
获取当前设备CPU使用信息
 */
router.get('/cpu-usage', async (req, res) => {
  const manager = new DeviceManager(sshOptions);
  const data = await manager.cpuUsage();
  res.json({
    ret: 0,
    data,
  });
});

/*
获取当前设备内存使用信息
 */
router.get('/memory', async (req, res) => {
  const manager = new DeviceManager(sshOptions);
  const data = await manager.memory();
  res.json({
    ret: 0,
    data,
  });
});

export default router;
