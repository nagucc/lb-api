import { expect } from 'chai';
import jwt from 'jsonwebtoken';

describe('jwt', () => {

  it('token generator', async () => {
    const secret = 'my secret';
    const token = jwt.sign({
      userId: 'test',
    }, secret);
    console.log(token);
  });
});
