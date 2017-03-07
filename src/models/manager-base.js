import { Client } from 'ssh2';
import { info } from '../config';

export default class ManagerBase {
  constructor(sshOptions) {
    this.sshOptions = sshOptions;
  }

  /*
登录ssh，并执行命令
   */
  run(commandHandler) {
    const conn = new Client();
    return new Promise((resolve, reject) => {
      conn.on('ready', () => {
        info('Client :: ready');
        let str = '';
        conn.shell({}, (err, stream) => {
          if (err) {
            reject(err);
            return;
          }
          stream.on('close', () => {
            conn.end();
          }).on('data', (data) => {
            str += data;
          }).stderr.on('data', (data) => {
            reject(data);
          }).on('end', () => {
            const result = commandHandler.handle(str);
            resolve(result);
          });
          stream.write('screen-length disable\n');
          stream.write(`${commandHandler.command}\n`);
          stream.end('exit\n');
        });
      }).connect(this.sshOptions);
    });
  }
}
