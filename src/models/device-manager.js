import handlers from '../handlers/device/index';
import ManagerBase from './manager-base';

export default class DeviceManager extends ManagerBase {
  cpuUsage() {
    return super.run(handlers.cpuUsage);
  }

  /*
获取内存数据
   */
  memory() {
    return super.run(handlers.memory);
  }

  fan() {
    return super.run(handlers.fan);
  }

  power() {
    return super.run(handlers.power);
  }

  environment() {
    return super.run(handlers.environment);
  }
}
