import CommandHandler from '../command-handler';
import { info } from '../../config';

/*
命令执行结果示例：
<TSG-LB>display power
Power 0     Status: Normal
Power 1     Status: Normal
 */

const parsePowerInfo = (data) => {
  info('parsePowerinfo text:', JSON.stringify(data));
  const reg = /Power (\d).+Status:\s+(\S+)/gm;
  const result = reg.exec(data);
  return {
    number: parseInt(result[1], 10),
    status: result[2],
  };
};
export default new CommandHandler('display power', (data) => {
  info('display power result:', JSON.stringify(data));
  const result = data.match(/Power \d.+/gm);
  return {
    powers: result.map(text => parsePowerInfo(text)),
  };
});
