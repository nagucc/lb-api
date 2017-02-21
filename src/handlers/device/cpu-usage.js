import CommandHandler from '../command-handler';
import { error, info } from '../../config';

/*
命令执行结果示例：
<Sysname> display cpu-usage
Slot 1 CPU 0 CPU usage:
       6% in last 5 seconds
      10% in last 1 minute
       5% in last 5 minutes

Slot 2 CPU 0 CPU usage:
       15% in last 5 seconds
       8% in last 1 minute
       25% in last 5 minutes
 */
const parseCpuInfo = (data) => {
  const reg = /Slot (\d) CPU (\d).+:\r*\n\s+(\d+)%.+5 seconds\r*\n\s+(\d+)%.+1 minute\r*\n\s+(\d+)%.+5 minutes/gm;
  const result = reg.exec(data);
  return {
    slot: parseInt(result[1], 10),
    number: parseInt(result[2], 10),
    usage: {
      last5s: parseInt(result[3], 10) / 100,
      last1m: parseInt(result[4], 10) / 100,
      last5m: parseInt(result[5], 10) / 100,
    },
  };
};

export default new CommandHandler('display cpu-usage', (data) => {
  info('Text for test:', JSON.stringify(data));
  const result = {};
  const slotTexts = data.match(/Slot \d CPU \d CPU.+\r*\n(.*\r*\n){2}.*last 5 minutes/gm);
  info('SlotTexts =', slotTexts);
  result.cpus = slotTexts.map(text => parseCpuInfo(text));
  return result;
});
