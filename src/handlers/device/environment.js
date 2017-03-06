import CommandHandler from '../command-handler';
import { info } from '../../config';

/*
命令执行结果示例：
<TSG-LB>display environment
 System Temperature information (degree centigrade):
-----------------------------------------------------------------------------------------
 Sensor   Temperature LowerLimit Warning-UpperLimit  Alarm-UpperLimit Shutdown-UpperLimit
inflow  1      28          0              60                70                NA
outflow 1      47          0              80                92                NA
 */

export default new CommandHandler('display environment', (data) => {
  info('display environment result:', JSON.stringify(data));
  const inflow = /inflow\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/gm.exec(data);
  const outflow = /outflow\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/gm.exec(data);
  return {
    inflow: {
      sensor: parseInt(inflow[1], 10),
      temperature: parseInt(inflow[2], 10),
      lowerLimit: parseInt(inflow[3], 10),
      warningUpperLimit: parseInt(inflow[4], 10),
      alermUpperLimit: parseInt(inflow[5], 10),
      shutdownUpperLimit: parseInt(inflow[6], 10),
    },
    outflow: {
      sensor: parseInt(outflow[1], 10),
      temperature: parseInt(outflow[2], 10),
      lowerLimit: parseInt(outflow[3], 10),
      warningUpperLimit: parseInt(outflow[4], 10),
      alermUpperLimit: parseInt(outflow[5], 10),
      shutdownUpperLimit: parseInt(outflow[6], 10),
    },
  };
});
