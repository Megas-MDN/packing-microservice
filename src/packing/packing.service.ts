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
  // ● Caixa 1: 30 x 40 x 80
  // ● Caixa 2: 50 x 50 x 40
  // ● Caixa 3: 50 x 80 x 60

  private caixasFakeDB: Caixa[] = [
    {
      id: 'Caixa 1',
      altura: 30,
      largura: 40,
      comprimento: 80,
    },
    {
      id: 'Caixa 2',
      altura: 50,
      largura: 50,
      comprimento: 40,
    },
    {
      id: 'Caixa 3',
      altura: 50,
      largura: 80,
      comprimento: 60,
    },
  ];

  // Retorna todas as caixas disponíveis
  getCaixas(): Caixa[] {
    return this.caixasFakeDB;
  }

  processarPedidos(payload: PackRequestDTO): PackResponseDTO {
    const resultado: PedidoResultDTO[] = [];

    for (const pedido of payload.pedidos) {
      const caixasUsadas: CaixaResultDTO[] = [];
      const produtosSobrando = [...pedido.produtos];

      // Enquanto houver produtos para empacotar
      while (produtosSobrando.length > 0) {
        let caixaEscolhida: Caixa | null = null;

        // Tenta achar a menor caixa que consiga acomodar pelo menos um produto
        for (const c of this.caixasFakeDB.sort(
          (a, b) => this.volume(a) - this.volume(b),
        )) {
          if (produtosSobrando.some((p) => this.cabeNaCaixa(c, p.dimensoes))) {
            caixaEscolhida = c;
            break;
          }
        }

        // Se nenhum produto couber em nenhuma caixa
        if (!caixaEscolhida) {
          const produto = produtosSobrando.shift()!;
          caixasUsadas.push({
            caixa_id: null,
            produtos: [produto.produto_id],
            observacao: 'Produto não cabe em nenhuma caixa disponível.',
          });
          continue;
        }

        // Agrupa produtos que cabem nesta caixa
        const produtosNaCaixa: string[] = [];
        const indiceParaRemover: number[] = [];

        produtosSobrando.forEach((p, idx) => {
          if (this.cabeNaCaixa(caixaEscolhida!, p.dimensoes)) {
            produtosNaCaixa.push(p.produto_id);
            indiceParaRemover.push(idx);
          }
        });

        // Remove produtos que já foram colocados na caixa
        for (let i = indiceParaRemover.length - 1; i >= 0; i--) {
          produtosSobrando.splice(indiceParaRemover[i], 1);
        }

        caixasUsadas.push({
          caixa_id: caixaEscolhida.id,
          produtos: produtosNaCaixa,
        });
      }

      resultado.push({
        pedido_id: pedido.pedido_id,
        caixas: caixasUsadas.sort((a, b) => {
          if (!a.caixa_id && !b.caixa_id) return 0;
          if (!a.caixa_id) return 1;
          if (!b.caixa_id) return -1;
          return b.caixa_id.localeCompare(a.caixa_id);
        }),
      });
    }

    return { pedidos: resultado };
  }

  // Calcula volume da caixa
  private volume(caixa: {
    altura: number;
    largura: number;
    comprimento: number;
  }) {
    return caixa.altura * caixa.largura * caixa.comprimento;
  }

  // Verifica se produto cabe na caixa (dimensões individuais)
  private cabeNaCaixa(
    caixa: { altura: number; largura: number; comprimento: number },
    dimensoes: { altura: number; largura: number; comprimento: number },
  ) {
    return (
      dimensoes.altura <= caixa.altura &&
      dimensoes.largura <= caixa.largura &&
      dimensoes.comprimento <= caixa.comprimento
    );
  }
}
