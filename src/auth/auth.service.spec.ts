import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('fake-jwt-token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a token when credentials are valid', async () => {
    const result = await service.login({
      email: 'tester@test.com',
      password: 'test@2025#',
    });
    expect(result).toEqual({ access_token: 'fake-jwt-token' });
    expect(jwtService.sign).toHaveBeenCalledWith({ email: 'tester@test.com' });
  });

  it('should throw UnauthorizedException when credentials are invalid', async () => {
    await expect(
      service.login({ email: 'wrong@test.com', password: 'wrongpass' }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
