import { expect } from 'chai';
import jwt from 'jsonwebtoken';

describe('jwt', () => {

  it('token generator', async () => {
    const secret = 'secret';
    const token = jwt.sign({
      userId: 'na57',
    }, secret);
    console.log(token);
  });
});
