import CommandHandler from '../command-handler';
import { info } from '../../config';

/*
负责均衡策略

命令执行结果

<TSG-LB>display loadbalance policy
LB policy: https-reverse-proxy
  Description:
  Type: HTTP
  Class: docker-production-https
   Action: to-docker-production-http-group
  Class: web-group
   Action: 到站群web
  Class: jinzhi-public
   Action: 到jinzhi-nginx集群
  Class: elearning-zlgc
   Action: 到elearning-zlgc服务器组
  Class: ecard.ynu.edu.cn==host
   Action: 到ecard.ynu.edu.cn
  Class: oa
   Action: to-oa-group
  Class: docker-development
   Action: to-docker-development-http-group
  Default class action: default-action

LB policy: https-reverse-proxy-transition
  Description:
  Type: HTTP
  Class: docker-production-https-transition
   Action: to-docker-production-http-group
  Class: any-ynu.edu.cn-site
   Action: redirect-to-https
  Default class action: default-action
 */

const handleClassActions = (data) => {
  info('class actions text:', JSON.stringify(data));
  const result = data.match(/\s*Class:(.*)\r*\n\s*Action:(.*)/gm);
  info('class actions length = ', result.length, result);
  return result.map((text) => {
    const cas = /Class:(.*)\r*\n\s*Action:(.*)/gm.exec(text);
    return {
      cls: cas[1].trim(),
      action: cas[2].trim(),
    };
  });
};
const handlePolicy = (data) => {
  info('policy Text:', JSON.stringify(data));
  const result = /LB policy:(.*)\r*\n\s*Description:(.*)\r*\n\s*Type:(.*)\r*\n((?:.*\r*\n)*).*Default class action:(.*)/gm.exec(data);
  return {
    name: result[1].trim(),
    description: result[2].trim(),
    type: result[3].trim(),
    classActions: handleClassActions(result[4]),
    defaultClassAction: result[5].trim(),
  };
};

const handleResult = (data) => {
  info('display loadbalance policy result:', JSON.stringify(data));
  const policyTexts = data.match(/LB policy:.+\r*\n(.+\r*\n?)*/gm);
  info('policy length = ', policyTexts.length);
  return policyTexts.map(p => handlePolicy(p));
};

export default () => new CommandHandler('display loadbalance policy', handleResult);
