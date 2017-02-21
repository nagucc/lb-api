import { expect } from 'chai';
import DeviceManager from '../src/models/device-manager';
import { sshOptions } from '../src/config';

describe('device manager', () => {
  const manager = new DeviceManager(sshOptions);
  it('CpuUsage()', async () => {
    const result = await manager.cpuUsage();
    expect(result.cpus.length).eql(1);
  });

  it('memory()', async () => {
    const result = await manager.memory();
    expect(result.memory.total).above(1000);
  });
});
