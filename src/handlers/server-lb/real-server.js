import CommandHandler from '../command-handler';
import { info } from '../../config';

/*

命令执行结果示例：
<TSG-LB>display real-server brief
Real server      Address              Port  State          Server farm
12.151:8080_r... 113.55.12.151        8080  Active         12.151:8080_sf
65031141-1       202.203.209.55       80    Active         65031141web...
app.ynu-1        113.55.12.76         80    Active         app.ynu
bbs-1            113.55.0.222         80    Shutdown       bbs
cjcx.yjs-1       202.203.209.55       50015 Active         cjcx.yjs
cjcx.yjs-2       113.55.12.65         50015 Active         cjcx.yjs
cms-1            113.55.0.226         80    Active         cms

<TSG-LB>display real-server statistics
Slot 1:
Real server: 12.151:8080_rs_113.55.12.151_8080
  Total connections: 66886
  Active connections: 0
  Max connections: 91
  Connections per second: 0
  Max connections per second: 28
  Server input: 1820686625 bytes
  Server output: 1827590287 bytes
  Throughput: 0 bytes/s
  Inbound throughput: 0 bytes/s
  Outbound throughput: 0 bytes/s
  Max throughput: 3997256 bytes/s
  Max inbound throughput: 3936660 bytes/s
  Max outbound throughput: 2023437 bytes/s
  Received packets: 2656543
  Sent packets: 2581424
  Dropped packets: 0
  Received requests: 0
  Dropped requests: 0
  Sent responses: 0
  Dropped responses: 0
  Connection failures: 0

Real server: 65031141-1
  Total connections: 398
  Active connections: 0
  Max connections: 7
  Connections per second: 0
  Max connections per second: 3


  <TSG-LB>display real-server name app.ynu-1
  Real server: app.ynu-1
    Description:
    State: Active
    IPv4 address: 113.55.12.76
    IPv6 address: --
    Port: 80
    Server farm: app.ynu������
    Weight: 100
    Priority: 4
    Cost: 0
    Slow shutdown: Disabled
    Connection limit: --
    Rate limit:
      Connections: --
      Bandwidth: --
      Inbound bandwidth: --
      Outbound bandwidth: --
    Bandwidth busy:
      Max bandwidth: --
      Max inbound bandwidth: --
      Max outbound bandwidth: --
      Busy rate: 70
      Inbound busy rate: 70
      Outbound busy rate: 70
    Probe information:
      Probe success criteria: All
      Probe method      State


      <TSG-LB>display real-server
      Real server: 12.151:8080_rs_113.55.12.151_8080
        Description:
        State: Active
        IPv4 address: 113.55.12.151
        IPv6 address: --
        Port: 8080
        Server farm: 12.151:8080_sf
        Weight: 100
        Priority: 4
        Cost: 0
        Slow shutdown: Disabled
        Connection limit: --
        Rate limit:
          Connections: --
          Bandwidth: --
          Inbound bandwidth: --
          Outbound bandwidth: --
        Bandwidth busy:
          Max bandwidth: --
          Max inbound bandwidth: --
          Max outbound bandwidth: --
          Busy rate: 70
          Inbound busy rate: 70
          Outbound busy rate: 70
        Probe information:
          Probe success criteria: All
          Probe method      State

      Real server: 65031141-1
        Description:
        State: Active
        IPv4 address: 202.203.209.55
        IPv6 address: --
        Port: 80
        Server farm: 65031141web������
        Weight: 100
        Priority: 4
        Cost: 0
        Slow shutdown: Disabled
        Connection limit: --
        Rate limit:
          Connections: --
          Bandwidth: --
          Inbound bandwidth: --
          Outbound bandwidth: --
        Bandwidth busy:
      <TSG-LB>
 */


const handleBrief = (data) => {
  info('display real-server brief result:', JSON.stringify(data));
  const rowsText = /Real server.*([\s\S]*)/gm.exec(data)[1];
  const rows = rowsText.match(/\r*\n\s*\S+\s+\S+\s+\S+\s+\S+\s+\S+/gm);
  const result = rows.map((row) => {
    const rowData = /(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)/g.exec(row);
    return {
      name: rowData[1],
      address: rowData[2],
      port: rowData[3],
      state: rowData[4],
      serverFarm: rowData[5],
    };
  });
  return result;
};

const handleAll = (data) => {
  info('display real-server result:', JSON.stringify(data));
  const objTexts = data.match(/Real server:.+\r*\n(.+\r*\n)*/mg);
  return objTexts.map((text) => {
    const getLineValue = (name) => {
      const reg = new RegExp(`${name}: ?(.*)`, 'g');
      const result = reg.exec(text);
      if (result) {
        if (result[1] === '--') return '';
        return result[1];
      }
      return null;
    };
    return {
      name: getLineValue('Real server'),
      description: getLineValue('Description'),
      state: getLineValue('State'),
      address: {
        v4: getLineValue('IPv4 address'),
        v6: getLineValue('IPv6 address'),
      },
      port: getLineValue('Port'),
      serverFarm: getLineValue('Server farm'),
      weight: parseInt(getLineValue('Weight'), 10),
      prority: getLineValue('Prority'),
      cost: getLineValue('Cost'),
      slowShutdown: getLineValue('Slow shutdown'),
      connectionLimit: getLineValue('Connection limit'),
    };
  });
};
const brief = () => new CommandHandler('display real-server brief', handleBrief);

const all = () => new CommandHandler('display real-server', handleAll);
export default {
  brief,
  all,
};
