import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(() => {
    strategy = new JwtStrategy();
  });

  it('should validate and return payload with email', async () => {
    const payload = { email: 'tester@test.com' };
    const result = await strategy.validate(payload);
    expect(result).toEqual({ email: 'tester@test.com' });
  });
});
