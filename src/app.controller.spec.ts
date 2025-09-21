import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { join } from 'path';

describe('AppController', () => {
  let appController: AppController;
  let mockResponse: any;

  beforeEach(async () => {
    // Configura o módulo de teste
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [],
    }).compile();

    appController = app.get<AppController>(AppController);

    mockResponse = {
      sendFile: jest.fn(),
    };
  });

  // Describe para agrupar testes relacionados
  describe('root', () => {
    it('should send the index.html file', () => {
      appController.getHome(mockResponse);

      expect(mockResponse.sendFile).toHaveBeenCalled();
      expect(mockResponse.sendFile).toHaveBeenCalledWith(
        join(__dirname, '..', 'public', 'index.html'),
      );
    });
  });
});
