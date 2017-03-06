import { expect } from 'chai';
import handlers from '../src/handlers/interface/index';

describe('interface handlers', () => {

  it('counters', () => {
    const data = `<Sysname> display counters inbound interface gigabitethernet
Interface            Total (pkts)    Broadcast (pkts)    Multicast (pkts)  Err (pkts)
GE1/0/0                     18761                9322                7424           0
GE1/0/1                         0                   0                   0           0
GE1/0/2                         0                   0                   0           0
GE1/0/3                         0                   0                   0           0
GE1/0/4                         0                   0                   0           0
GE1/0/5                         0                   0                   0           0
GE1/0/6                         0                   0                   32           0
XGE1/0/24                  361                268                 36           0
XGE1/0/25          27955119771          274447592           24544175           0
XGE1/0/26                    0                  0                  0           0
XGE1/0/27                    0                  0                  0           0
`;
    const result = handlers.counters.inbound.handle(data);
    expect(result.ge[0].total).eql(18761);
    expect(result.ge[6].multicast).eql(32);
    expect(result.xge[0].total).eql(361);
    expect(result.xge[1].broadcast).eql(274447592);
  });

  it('interface brief', () => {
    const data = `<TSG-LB>display interface brief
    Brief information on interfaces in route mode:
    Link: ADM - administratively down; Stby - standby
    Protocol: (s) - spoofing
    Interface            Link Protocol Primary IP      Description
    GE1/0/0              DOWN DOWN     --
    GE1/0/1              DOWN DOWN     --
    GE1/0/2              DOWN DOWN     --
    GE1/0/3              DOWN DOWN     --
    GE1/0/4              DOWN DOWN     --
    GE1/0/5              UP   UP       10.0.0.1
    InLoop0              UP   UP(s)    --
    NULL0                UP   UP(s)    --
    XGE1/0/24            DOWN DOWN     --
    XGE1/0/25            UP   UP       --
    XGE1/0/25.25         UP   UP       202.203.208.3
    XGE1/0/25.26         UP   UP       202.203.209.4
    XGE1/0/25.28         UP   UP       113.55.12.35
    XGE1/0/26            DOWN DOWN     --
    XGE1/0/27            DOWN DOWN     --`;
    const result = handlers.ni.brief().handle(data);
    expect(result.ge[1].name).eql('GE1/0/1');
    expect(result.ge[5].primaryIP).eql('10.0.0.1');
    expect(result.xge[0].name).eql('XGE1/0/24');
    expect(result.xge[6].link).eql('DOWN');
    expect(result.inLoop[0].name).eql('InLoop0');
  });

  // describe('interface byName', () => {
  //   it('interface GigabitEthernet', () => {
  //     const
  //   })
  // })
});
