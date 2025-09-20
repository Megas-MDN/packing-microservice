import { Test, TestingModule } from '@nestjs/testing';
import { PackingService } from './packing.service';
import * as fs from 'fs';
import * as path from 'path';

describe('PackingService', () => {
  let service: PackingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PackingService],
    }).compile();

    service = module.get<PackingService>(PackingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should process pedidos correctly from entrada.json', () => {
    const entradaPath = path.join(__dirname, '../../entrada.json');
    const saidaPath = path.join(__dirname, '../../saida.json');

    const entradaJSON = JSON.parse(fs.readFileSync(entradaPath, 'utf-8'));
    const saidaEsperada = JSON.parse(fs.readFileSync(saidaPath, 'utf-8'));

    const resultado = service.processarPedidos(entradaJSON);
    console.log('resultado', JSON.stringify(resultado, null, 2));
    expect(resultado).toEqual(saidaEsperada);
  });
});
