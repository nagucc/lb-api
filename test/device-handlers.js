import { expect } from 'chai';
import handlers from '../src/handlers/device/index';

describe('device handlers', () => {

  it('CPU Usage Handler', () => {
    const data = `<Sysname> display cpu-usage
    Slot 1 CPU 0 CPU usage:
         6% in last 5 seconds
        10% in last 1 minute
         5% in last 5 minutes

    Slot 2 CPU 0 CPU usage:
         15% in last 5 seconds
         8% in last 1 minute
         25% in last 5 minutes`;
    const result = handlers.cpuUsage.handle(data);
    expect(result.cpus.length).eql(2);
    expect(result.cpus[0].slot).eql(1);
    expect(result.cpus[1].number).eql(0);
    expect(result.cpus[0].usage.last5s).eql(0.06);
    expect(result.cpus[1].usage.last5m).eql(0.25);
  });

  it('Memory Handler', () => {
    const data = `<Sysname> display memory
    The statistics about memory is measured in KB:
    Slot 0:
                 Total      Used      Free    Shared   Buffers    Cached   FreeRatio
    Mem:        507980    154896    353084         0       488     54488       69.5%
    -/+ Buffers/Cache:     99920    408060
    Swap:           0         0         0`;
    const result = handlers.memory.handle(data);
    expect(result.slot).eql(0);
    expect(result.memory.total).eql(507980);
    expect(result.memory.free).eql(353084);
  });
});