import CommandHandler from '../command-handler';
import { info } from '../../config';

/*
命令执行结果示例：
<Sysname> display memory
The statistics about memory is measured in KB:
Slot 0:
             Total      Used      Free    Shared   Buffers    Cached   FreeRatio
Mem:        507980    154896    353084         0       488     54488       69.5%
-/+ Buffers/Cache:     99920    408060
Swap:           0         0         0
 */

// 目前仅支持单slot
export default new CommandHandler('display memory', (data) => {
  info('Text for test:', JSON.stringify(data));
  const reg = /Slot (\d+):.*\r*\n.+\r*\n\s*Mem\D+(\d+)\s+(\d+)\s+(\d+)/gm;
  const result = reg.exec(data);
  return {
    slot: parseInt(result[1], 10),
    memory: {
      total: parseInt(result[2], 10),
      used: parseInt(result[3], 10),
      free: parseInt(result[4], 10),
    },
  };
});
