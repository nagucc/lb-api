import CommandHandler from '../command-handler';
import { info } from '../../config';

/*
实服务组信息

命令执行结果示例

<TSG-LB>display server-farm
Server farm: 12.151:8080_sf
  Description:
  Predictor: Round robin
  Proximity: Disabled
  NAT: Enabled
  SNAT pool:
  Failed action: Keep
  Active threshold: Disabled
  Slow-online: Disabled
  Selected server: Disabled
  Probe information:
    Probe success criteria: All
    Probe method:
  Total real server: 1
  Active real server: 1
  Real server list:
  Name             State         Address              Port  Weight Priority
  12.151:8080_r... Active        113.55.12.151        8080  100    4

Server farm: 65031141web������
  Description:
  Predictor: Round robin
  Proximity: Disabled
  NAT: Enabled
  SNAT pool:
  Failed action: Keep
  Active threshold: Disabled
  Slow-online: Disabled
  Selected server: Disabled
  Probe information:
    Probe success criteria: All
    Probe method:
  Total real server: 1
  Active real server: 1
  Real server list:
  Name             State         Address              Port  Weight Priority
  65031141-1       Active        202.203.209.55       80    100    4

Server farm: app.ynu������
  Description:
  Predictor: Round robin
  Proximity: Disabled
  NAT: Enabled
  SNAT pool:
  Failed action: Keep
  Active threshold: Disabled
 */

const handleAll = (data) => {
  info('display server-farm result:', JSON.stringify(data));
  const objTexts = data.match(/Server farm:.+\r*\n(.+\r*\n)*/gm);
  return objTexts.map((text) => {
    const getLineValue = (name) => {
      const reg = new RegExp(`${name}: ?(.*)`, 'g');
      const result = reg.exec(text);
      if (result) {
        if (result[1] === '--') return '';
        return result[1];
      }
      return null;
    };
    return {
      name: getLineValue('Server farm'),
      description: getLineValue('Description'),
      predictor: getLineValue('Predictor'),
      totalRealServer: parseInt(getLineValue('Total real server'), 10),
      activeRealServer: parseInt(getLineValue('Active real server'), 10),
    };
  });
};

const all = () => new CommandHandler('display server-farm', handleAll);

export default {
  all,
};
