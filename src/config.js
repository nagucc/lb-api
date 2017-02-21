import debug from 'debug';

// debug
export const error = debug('lb-api:error');
export const info = debug('lb-api:info');

export const sshOptions = {
  host: process.env.LB_SSH_HOST,
  port: process.env.LB_SSH_PORT || 22,
  username: process.env.LB_SSH_USER,
  password: process.env.LB_SSH_PASS,
  algorithms: {
    cipher: ['aes128-cbc'],
  },
};
export const port = process.env.PORT || 3000;
export const host = process.env.WEBSITE_HOSTNAME || `localhost:${port}`;
export const cookieKey = process.env.COOKIE_KEY || 'my cookie key';
