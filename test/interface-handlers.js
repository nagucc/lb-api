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
`;
    const result = handlers.counters.inbound.handle(data);
    expect(result.ge[0].total).eql(18761);
    expect(result.ge[6].multicast).eql(32);
  });
});
