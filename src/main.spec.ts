import { Test } from '@nestjs/testing';
import { AppModule } from './app.module';

describe('Main bootstrap', () => {
  it('should compile AppModule without errors', async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    expect(module).toBeDefined();
  });
});
