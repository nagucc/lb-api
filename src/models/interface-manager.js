import handlers from '../handlers/interface/index';
import ManagerBase from './manager-base';

export default class InterfaceManager extends ManagerBase {
  brief() {
    return super.run(handlers.ni.brief());
  }
  inboundCounters() {
    return super.run(handlers.counters.inbound);
  }
  outboundCounters() {
    return super.run(handlers.counters.outbound);
  }
}
