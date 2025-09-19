import { Injectable } from '@nestjs/common';
import { PackRequestDTO } from './dto/pack-request.dto';
import {
  PackResponseDTO,
  PedidoResultDTO,
  CaixaResultDTO,
} from './dto/pack-response.dto';
import { Caixa } from './entities/caixa.entity';

@Injectable()
export class PackingService {
  // FakeDB (simula tabelas/coleções)
  private caixasFakeDB: Caixa[] = [
    { id: 'Caixa 1', altura: 40, largura: 40, comprimento: 40 },
    { id: 'Caixa 2', altura: 60, largura: 50, comprimento: 50 },
    { id: 'Caixa 3', altura: 100, largura: 100, comprimento: 100 },
  ];

  // Retorna todas as caixas disponíveis (simulação de GET no banco)
  getCaixas(): Caixa[] {
    return this.caixasFakeDB;
  }

  processarPedidos(payload: PackRequestDTO): PackResponseDTO {
    const resultado: PedidoResultDTO[] = [];

    for (const pedido of payload.pedidos) {
      const caixasUsadas: CaixaResultDTO[] = [];

      for (const produto of pedido.produtos) {
        const caixa = this.encontrarCaixa(produto.dimensoes);

        if (caixa) {
          caixasUsadas.push({
            caixa_id: caixa.id,
            produtos: [produto.produto_id],
          });
        } else {
          caixasUsadas.push({
            caixa_id: null,
            produtos: [produto.produto_id],
            observacao: 'Produto não cabe em nenhuma caixa disponível.',
          });
        }
      }

      resultado.push({
        pedido_id: pedido.pedido_id,
        caixas: caixasUsadas,
      });
    }

    return { pedidos: resultado };
  }

  private encontrarCaixa(dimensoes: {
    altura: number;
    largura: number;
    comprimento: number;
  }) {
    return this.caixasFakeDB.find(
      (caixa) =>
        dimensoes.altura <= caixa.altura &&
        dimensoes.largura <= caixa.largura &&
        dimensoes.comprimento <= caixa.comprimento,
    );
  }
}
