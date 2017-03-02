import CommandHandler from '../command-handler';
import { info } from '../../config';

/*
接口的流量统计信息

命令执行结果示例：
<Sysname> display counters inbound interface gigabitethernet
Interface            Total (pkts)    Broadcast (pkts)    Multicast (pkts)  Err (pkts)
GE1/0/0                     18761                9322                7424           0
GE1/0/1                         0                   0                   0           0
GE1/0/2                         0                   0                   0           0
GE1/0/3                         0                   0                   0           0
GE1/0/4                         0                   0                   0           0
GE1/0/5                         0                   0                   0           0
GE1/0/6                         0                   0                   0           0

 */

const parseGe = (ge) => {
  info('parseGe text:', JSON.stringify(ge));
  const result = /(X?GE\d+\/\d+\/\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/gm.exec(ge);
  return {
    name: result[1],
    total: parseInt(result[2], 10),
    broadcast: parseInt(result[3], 10),
    multicast: parseInt(result[4], 10),
    err: parseInt(result[5], 10),
  };
};

const handleData = (data) => {
  info('display counters inbound/outbound result:', JSON.stringify(data));
  const geResult = data.match(/GE\d+\/\d+\/\d+.+/gm);
  const xgeResult = data.match(/XGE\d+\/\d+\/\d+.+/gm);
  return {
    ge: geResult.map(text => parseGe(text)),
    xge: xgeResult.map(text => parseGe(text)),
  };
};

const inbound = new CommandHandler('display counters inbound interface', handleData);

const outbound = new CommandHandler('display counters outbound interface', handleData);

export default {
  inbound,
  outbound,
};
