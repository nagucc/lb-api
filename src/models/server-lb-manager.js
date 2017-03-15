import handlers from '../handlers/server-lb';
import ManagerBase from './manager-base';

export default class ServerLbManager extends ManagerBase {
  virtualServers() {
    return super.run(handlers.virtualServer.all());
  }
  serverFarms() {
    return super.run(handlers.serverFarm.all());
  }
  realServers() {
    return super.run(handlers.realServer.all());
  }
  realServerBrief() {
    return super.run(handlers.realServer.brief());
  }
  lbPolicy() {
    return super.run(handlers.lbPolicy());
  }
  lbClass() {
    return super.run(handlers.lbClass());
  }
}
