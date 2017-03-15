import CommandHandler from '../command-handler';
import { info } from '../../config';

/*
负责均衡策略

命令执行结果

<TSG-LB>display loadbalance action
LB action: redirect-to-https
  Description:
  Type: Generic
  State: Active
  Forward type: Server farm
  Server farm: redirect-to-https (in use)
  Backup server farm:
  Sticky:
  IP ToS:
  Fallback-action: Disabled

LB action: to-docker-development-http-group
  Description:
  Type: Generic
  State: Active
  Forward type: Server farm
  Server farm: docker-development-http-group (in use)
  Backup server farm:
  Sticky:
  IP ToS:
  Fallback-action: Disabled
*/

const handleAction = (data) => {
  info('action text:', JSON.stringify(data));
  const result = /LB action:(.*)\r*\n\s*Description:(.*)\r*\n\s*Type:(.*)\r*\n\s*State:(.*)\r*\n.*\r*\n\s*Server farm:(.*)/gm.exec(data);
  return {
    name: result[1].trim(),
    description: result[2].trim(),
    type: result[3].trim(),
    state: result[4].trim(),
    serverFarm: result[5].trim(),
  };
};
const handleResult = (data) => {
  info('display loadbalance action result:', JSON.stringify(data));
  const actionTexts = data.match(/LB action:.+\r*\n(.+\r*\n?)*/gm);
  info('action length = ', actionTexts.length);
  return actionTexts.map(a => handleAction(a));
};
export default () => new CommandHandler('display loadbalance action', handleResult);
