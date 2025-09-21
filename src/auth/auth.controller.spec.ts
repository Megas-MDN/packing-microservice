import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest
              .fn()
              .mockResolvedValue({ access_token: 'fake-jwt-token' }),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call AuthService.login and return token', async () => {
    const result = await controller.login({
      email: 'tester@test.com',
      password: 'test@2025#',
    });

    expect(result).toEqual({ access_token: 'fake-jwt-token' });
    expect(service.login).toHaveBeenCalledWith({
      email: 'tester@test.com',
      password: 'test@2025#',
    });
  });
});
