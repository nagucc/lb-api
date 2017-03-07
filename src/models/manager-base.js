import { Client } from 'ssh2';
import { info, error } from '../config';

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
        conn.shell((err, stream) => {
          if (err) {
            error('Shell Error:', err);
            reject(err);
            return;
          }
          stream.on('close', () => {
            // conn.end();
            // info('Client :: end');
          }).on('data', (data) => {
            str += data;
          }).stderr.on('data', (data) => {
            reject(data);
          }).on('end', () => {
            const result = commandHandler.handle(str);
            resolve(result);
            conn.end();
            info('Client :: end');
          });
          stream.write('screen-length disable\n');
          stream.write(`${commandHandler.command}\n`);
          stream.end('exit\n');
        });
      }).on('error', (err) => {
        error('Client Error:', err);
      }).connect(this.sshOptions);
    });
  }
}
