import { Test, TestingModule } from '@nestjs/testing';
import { PackingController } from './packing.controller';
import { PackingService } from './packing.service';
import * as fs from 'fs';
import * as path from 'path';

describe('PackingController', () => {
  let controller: PackingController;
  let service: PackingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PackingController],
      providers: [PackingService],
    }).compile();

    controller = module.get<PackingController>(PackingController);
    service = module.get<PackingService>(PackingService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('POST /packing should return correct packing', () => {
    const entradaPath = path.join(__dirname, '../../entrada.json');
    const saidaPath = path.join(__dirname, '../../saida.json');

    const entradaJSON = JSON.parse(fs.readFileSync(entradaPath, 'utf-8'));
    const saidaEsperada = JSON.parse(fs.readFileSync(saidaPath, 'utf-8'));

    const resultado = controller.processar(entradaJSON);

    expect(resultado).toEqual(saidaEsperada);
  });
});
