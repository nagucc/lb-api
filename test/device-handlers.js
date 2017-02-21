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

  it('Fan Handler', () => {
    const data = `<TSG-LB>display fan
Fan 0      Status: Normal  Speed:2347
Fan 1      Status: Normal  Speed:2347
Fan 2      Status: Normal  Speed:3269
Fan 3      Status: Normal  Speed:3212`;
    const result = handlers.fan.handle(data);
    expect(result.fans.length).eql(4);
    expect(result.fans[0].number).eql(0);
    expect(result.fans[2].status).eql('Normal');
    expect(result.fans[3].speed).eql(3212);
  });

  it('Power Handler', () => {
    const data = `<TSG-LB>display power
Power 0     Status: Normal
Power 1     Status: Normal`;
    const result = handlers.power.handle(data);
    expect(result.powers.length).eql(2);
    expect(result.powers[0].number).eql(0);
    expect(result.powers[1].status).eql('Normal');
  });

  it('Environment Handler', () => {
    const data = `<TSG-LB>display environment
 System Temperature information (degree centigrade):
-----------------------------------------------------------------------------------------
 Sensor   Temperature LowerLimit Warning-UpperLimit  Alarm-UpperLimit Shutdown-UpperLimit
inflow  1      28          0              60                70                NA
outflow 1      47          0              80                92                NA`;
    const result = handlers.environment.handle(data);
    expect(result.inflow.temperature).eql(28);
    expect(result.outflow.warningUpperLimit).eql(80);
  });
});
