import CommandHandler from '../command-handler';
import { info } from '../../config';

/*
命令执行结果示例：
<TSG-LB>display fan
Fan 0      Status: Normal  Speed:2347
Fan 1      Status: Normal  Speed:2347
Fan 2      Status: Normal  Speed:3269
Fan 3      Status: Normal  Speed:3212
 */

const parseFanInfo = (data) => {
  info('parseFaninfo text:', JSON.stringify(data));
  const reg = /Fan (\d).+Status:\s+(\S+)\s+Speed:(\d+)/gm;
  const result = reg.exec(data);
  return {
    number: parseInt(result[1], 10),
    status: result[2],
    speed: parseInt(result[3], 10),
  };
};
export default new CommandHandler('display fan', (data) => {
  info('display fan result:', JSON.stringify(data));
  const result = data.match(/Fan \d.+/gm);
  return {
    fans: result.map(text => parseFanInfo(text)),
  };
});
