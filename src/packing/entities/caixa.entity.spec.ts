import { Caixa } from './caixa.entity';

describe('Caixa entity', () => {
  it('should create a Caixa with correct properties', () => {
    const caixa: Caixa = { id: 'C1', altura: 10, largura: 20, comprimento: 30 };

    expect(caixa.id).toBe('C1');
    expect(caixa.altura).toBe(10);
    expect(caixa.largura).toBe(20);
    expect(caixa.comprimento).toBe(30);
  });
});
