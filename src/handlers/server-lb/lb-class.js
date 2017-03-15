import CommandHandler from '../command-handler';
import { info, error } from '../../config';

/*
负载均衡流分类器

命令执行结果

<TSG-LB>display loadbalance class
LB class: 65031141.ynu.edu.cn==host
  Description:
  Type: HTTP
  Match type: Match-all
  Match rule:
    match 1 header host value 65031141.ynu.edu.cn

LB class: any-ynu.edu.cn-site
  Description:
  Type: HTTP
  Match type: Match-any
  Match rule:
    match 1 header host value .+\.ynu\.edu\.cn

LB class: docker-production-https
  Description:
  Type: HTTP
  Match type: Match-any
  Match rule:
    match 1 header host value ^api\.ynu
    match 2 header host value ^kong-dashboard\.ynu
    match 3 header host value ^ecard-wxe\.ynu
    match 4 header host value ^jxcg\.ynu
    match 5 header host value ^op-itc\.ynu
    match 6 header host value ^go\.ynu
    match 7 header host value ^mq\.ynu
 */

const handleRules = (data) => {
  info('rules text:', JSON.stringify(data));
  const rules = data.match(/match.+/gm);
  info('rules lenght = ', rules.length);
  return rules.map((text) => {
    try {
      const rule = /match\s+(\d+)\s+header\s+(\S+)\s+value\s+(\S+)/gm.exec(text);
      return {
        id: rule[1],
        header: rule[2],
        value: rule[3],
      };
    } catch (e) {
      error('解析规则异常：', JSON.stringify(text));
      return `未知规则：${JSON.stringify(text)}`;
    }
  });
};
const handleClass = (data) => {
  info('class Text:', JSON.stringify(data));
  const result = /LB class:(.*)\r*\n\s*Description:(.*)\r*\n\s*Type:(.*)\r*\n\s*Match type:(.*)\r*\n\s*Match rule:.*\r*\n((?:\s*match \d+.+\r*\n?)*)/gm.exec(data);
  return {
    name: result[1].trim(),
    description: result[2].trim(),
    type: result[3].trim(),
    matchType: result[4].trim(),
    matchRules: handleRules(result[5]),
  };
};
const handleResult = (data) => {
  info('display loadbalance class result:', JSON.stringify(data));
  const classTexts = data.match(/LB class:.+\r*\n(.+\r*\n?)*/gm);
  info('class length = ', classTexts.length);
  return classTexts.map(c => handleClass(c));
};

export default() => new CommandHandler('display loadbalance class', handleResult);
