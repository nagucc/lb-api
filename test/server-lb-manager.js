import { expect } from 'chai';
import ServerLbManager from '../src/models/server-lb-manager';
import { sshOptions } from '../src/config';

describe('server lb manager', () => {
  const manager = new ServerLbManager(sshOptions);
  it('virtualServers()', async () => {
    const result = await manager.virtualServers();
    expect(result.length).above(0);
  });

  it('serverFarms()', async () => {
    const result = await manager.serverFarms();
    expect(result.length).above(0);
  });

  it('realServers()', async () => {
    const result = await manager.realServers();
    expect(result.length).above(0);
  });
  it('lbPolicy()', async () => {
    const result = await manager.lbPolicy();
    expect(result.length).above(0);
  });
  it('lbClass()', async() => {
    const result = await manager.lbClass();
    console.log(result);
  });
});
