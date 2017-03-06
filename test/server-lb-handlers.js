import { expect } from 'chai';
import handlers from '../src/handlers/server-lb/index';

describe('server-lb handlers', () => {
  describe('real-server', () => {
    it('brief', () => {
      const data = `<TSG-LB>display real-server brief
      Real server      Address              Port  State          Server farm
      12.151:8080_r... 113.55.12.151        8080  Active         12.151:8080_sf
      65031141-1       202.203.209.55       80    Active         65031141web...
      app.ynu-1        113.55.12.76         80    Active         app.ynu
      bbs-1            113.55.0.222         80    Shutdown       bbs
      cjcx.yjs-1       202.203.209.55       50015 Active         cjcx.yjs
      cjcx.yjs-2       113.55.12.65         50015 Active         cjcx.yjs
      cms-1            113.55.0.226         80    Active         cms
      <TSG-LB>exit`;
      const result = handlers.realServer.brief().handle(data);
      expect(result.length).eql(7);
      expect(result[2].name).eql('app.ynu-1');
    });

    it('all', () => {
      const data = `<TSG-LB>display real-server
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
<TSG-LB>`;
      const result = handlers.realServer.all().handle(data);
      expect(result.length).eql(2);
      expect(result[0].name).eql('12.151:8080_rs_113.55.12.151_8080');
    });
  });

  describe('server-farm', () => {
    it('all', () => {
      const data = `<TSG-LB>display server-farm
Server farm: 12.151:8080_sf
  Description:
  Predictor: Round robin
  Proximity: Disabled
  NAT: Enabled
  SNAT pool:
  Failed action: Keep
  Active threshold: Disabled
  Slow-online: Disabled
  Selected server: Disabled
  Probe information:
    Probe success criteria: All
    Probe method:
  Total real server: 1
  Active real server: 1
  Real server list:
  Name             State         Address              Port  Weight Priority
  12.151:8080_r... Active        113.55.12.151        8080  100    4

Server farm: 65031141web������
  Description:
  Predictor: Round robin
  Proximity: Disabled
  NAT: Enabled
  SNAT pool:
  Failed action: Keep
  Active threshold: Disabled
  Slow-online: Disabled
  Selected server: Disabled
  Probe information:
    Probe success criteria: All
    Probe method:
  Total real server: 1
  Active real server: 1
  Real server list:
  Name             State         Address              Port  Weight Priority
  65031141-1       Active        202.203.209.55       80    100    4

Server farm: app.ynu������
  Description:
  Predictor: Round robin
  Proximity: Disabled
  NAT: Enabled
  SNAT pool:
  Failed action: Keep
  Active threshold: Disabled`;
      const result = handlers.serverFarm.all().handle(data);
      expect(result.length).eql(3);
      expect(result[0].name).eql('12.151:8080_sf');
      expect(result[1].totalRealServer).eql(1);
    });
  });
  describe('virtual-server', () => {
    it('all', () => {
      const data = `<TSG-LB>display virtual-server
Virtual server: 12.151:8080
  Description:
  Type: TCP
  State: Active
  VPN instance:
  Virtual IPv4 address: 202.203.208.37/32
  Virtual IPv6 address: --
  Port: 48080
  Primary server farm: 12.151:8080_sf (in use)
  Backup server farm:
  Sticky:
  LB policy:
  LB limit-policy:
  Connection limit: --
  Rate limit:
    Connections: --
    Bandwidth: --
    Inbound bandwidth: --
    Outbound bandwidth: --
  Connection synchronization: Disabled
  Sticky synchronization: Disabled
  Bandwidth busy protection: Disabled
  Bandwidth interface statistics: Disabled

Virtual server: 208.28-ssh�˿�����
  Description:
  Type: IP
  State: Active
  VPN instance:
  Virtual IPv4 address: 202.203.208.28/32
  Virtual IPv6 address: --
  Port: 22
  Primary server farm: kippo (in use)
  Backup server farm:
  Sticky:
  LB policy:
  LB limit-policy:
  Connection limit: --
  Rate limit:
    Connections: --
    Bandwidth: --
    Inbound bandwidth: --
    Outbound bandwidth: --
  Connection synchronization: Disabled
  Sticky synchronization: Disabled
  Bandwidth busy protection: Disabled
  Bandwidth interface statistics: Disabled

Virtual server: 208.3-ssh�˿�����
  Description:
  Type: IP
  State: Active
  VPN instance:
  Virtual IPv4 address: 202.203.208.3/32
  Virtual IPv6 address: --
  Port: 22
  Primary server farm: kippo (in use)
  Backup server farm:
  Sticky:
  LB policy:
  LB limit-policy:
  Connection limit: --
  Rate limit:
    Connections: --
    Bandwidth: --
    Inbound bandwidth: --
    Outbound bandwidth: --
  Connection synchronization: Disabled
  Sticky synchronization: Disabled`;
      const result = handlers.virtualServer.all().handle(data);
      console.log(result);
    });
  });
});
