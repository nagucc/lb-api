import CommandHandler from '../command-handler';
import { info } from '../../config';

/*
显示指定接口当前的运行状态和相关信息。

命令执行结果示例：
<TSG-LB>display interface brief
Brief information on interfaces in route mode:
Link: ADM - administratively down; Stby - standby
Protocol: (s) - spoofing
Interface            Link Protocol Primary IP      Description
GE1/0/0              DOWN DOWN     --
GE1/0/1              DOWN DOWN     --
GE1/0/2              DOWN DOWN     --
GE1/0/3              DOWN DOWN     --
GE1/0/4              DOWN DOWN     --
GE1/0/5              UP   UP       10.0.0.1
InLoop0              UP   UP(s)    --
NULL0                UP   UP(s)    --
XGE1/0/24            DOWN DOWN     --
XGE1/0/25            UP   UP       --
XGE1/0/25.25         UP   UP       202.203.208.3
XGE1/0/25.26         UP   UP       202.203.209.4
XGE1/0/25.28         UP   UP       113.55.12.35
XGE1/0/26            DOWN DOWN     --
XGE1/0/27            DOWN DOWN     --
 */

const parseRow = (ge) => {
  info('parseRow text:', JSON.stringify(ge));
  const result = /(\S+)\s+(\S+)\s+(\S+)\s+(\S+)(\s+)?(\S+)?/g.exec(ge);
  return {
    name: result[1],
    link: result[2],
    protocol: result[3],
    primaryIP: result[4],
    description: result[6],
  };
};

const handleAllInterfacesBrief = (data) => {
  info('display interface brief result:', JSON.stringify(data));
  const geResult = data.match(/GE\d+\/\d+\/\d+.+/gm);
  const xgeResult = data.match(/XGE\d+\/\d+\/\d+.+/gm);
  const inLoopResult = data.match(/InLoop\d+.+/gm);
  return {
    ge: geResult.map(text => parseRow(text)),
    xge: xgeResult.map(text => parseRow(text)),
    inLoop: inLoopResult.map(text => parseRow(text)),
  };
};
const brief = () => new CommandHandler('display interface brief', handleAllInterfacesBrief);

// const byName = (name) => {
//   const result = /(X?)(GE)(\S+)/g.exec(name);
//   console.log(result);
//   // if(result[2]) throw new Error('Bad interface name');
//   // if(result[1])
//   const cmd = `display interface GigabitEthernet${name}`;
//   return new CommandHandler('disp');
// };
export default {
  brief,
};
