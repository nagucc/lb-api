import { expect } from 'chai';
import cpuUsageHandler from '../src/device/cpu-usage';

describe('device', () => {

  it('CPU Usage Handler', () => {
    const data = `(Sysname) display cpu-usage
    Slot 1 CPU 0 CPU usage:
         6% in last 5 seconds
        10% in last 1 minute
         5% in last 5 minutes

    Slot 2 CPU 0 CPU usage:
         15% in last 5 seconds
         8% in last 1 minute
         25% in last 5 minutes`;
    const result = cpuUsageHandler.handle(data);
    expect(result.cpus.length).eql(2);
    expect(result.cpus[0].slot).eql(1);
    expect(result.cpus[1].number).eql(0);
    expect(result.cpus[0].usage.last5s).eql(0.06);
    expect(result.cpus[1].usage.last5m).eql(0.25);
  });


});
