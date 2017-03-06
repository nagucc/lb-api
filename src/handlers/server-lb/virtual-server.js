import CommandHandler from '../command-handler';
import { info } from '../../config';

/*
虚服务信息


命令执行结果：

<TSG-LB>display virtual-server
Virtual server: 12.151:8080
  Description:
  Type: TCP
  State: Active
  VPN instance:
  Virtual IPv4 address: 202.203.208.37/32
  Virtual IPv6 address: --
  Port: 48080
  Primary server farm: 12.151:8080_sf (in use)
  Backup server farm:
  Sticky:
  LB policy:
  LB limit-policy:
  Connection limit: --
  Rate limit:
    Connections: --
    Bandwidth: --
    Inbound bandwidth: --
    Outbound bandwidth: --
  Connection synchronization: Disabled
  Sticky synchronization: Disabled
  Bandwidth busy protection: Disabled
  Bandwidth interface statistics: Disabled

Virtual server: 208.28-ssh�˿�����
  Description:
  Type: IP
  State: Active
  VPN instance:
  Virtual IPv4 address: 202.203.208.28/32
  Virtual IPv6 address: --
  Port: 22
  Primary server farm: kippo (in use)
  Backup server farm:
  Sticky:
  LB policy:
  LB limit-policy:
  Connection limit: --
  Rate limit:
    Connections: --
    Bandwidth: --
    Inbound bandwidth: --
    Outbound bandwidth: --
  Connection synchronization: Disabled
  Sticky synchronization: Disabled
  Bandwidth busy protection: Disabled
  Bandwidth interface statistics: Disabled

Virtual server: 208.3-ssh�˿�����
  Description:
  Type: IP
  State: Active
  VPN instance:
  Virtual IPv4 address: 202.203.208.3/32
  Virtual IPv6 address: --
  Port: 22
  Primary server farm: kippo (in use)
  Backup server farm:
  Sticky:
  LB policy:
  LB limit-policy:
  Connection limit: --
  Rate limit:
    Connections: --
    Bandwidth: --
    Inbound bandwidth: --
    Outbound bandwidth: --
  Connection synchronization: Disabled
  Sticky synchronization: Disabled
 */

const handleAll = (data) => {
  info('display virtual-server result:', JSON.stringify(data));
  const objTexts = data.match(/Virtual server:.+\r*\n(.+\r*\n)*/gm);
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
      name: getLineValue('Virtual server'),
      description: getLineValue('Description'),
      type: getLineValue('Type'),
      state: getLineValue('State'),
      address: {
        v4: getLineValue('Virtual IPv4 address'),
        v6: getLineValue('Virtual IPv6 address'),
      },
      port: getLineValue('Port'),
      primaryServerFarm: getLineValue('Primary server farm'),
      lbPolicy: getLineValue('LB Policy'),
    };
  });
};

const all = () => new CommandHandler('display virtual-server', handleAll);

export default {
  all,
};
