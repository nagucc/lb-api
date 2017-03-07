import amqp from 'amqplib';
import { amqpUrl, requestQueueName } from './config';

/*
从request中获取jwt
 */
export const getToken = (req) => {
  if (req.query && req.query.token) {
    return req.query.token;
  }
  return '';
};

export const sendRequestToQueue = getMessage => async (req, res, next) => {
  getMessage = getMessage || ((req, res) => ({
    user: req.user,
    moudle: 'lb-api',
    url: req.originalUrl,
    datetime: Date.now(),
  }));
  const message = getMessage(req, res);
  const connection = await amqp.connect(amqpUrl);
  const channel = await connection.createChannel();
  channel.assertQueue(requestQueueName);
  channel.sendToQueue(requestQueueName, new Buffer(JSON.stringify(message)));
  next();
};
