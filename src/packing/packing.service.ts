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
        let caixaEscolhida: Caixa | null = null; // Tenta achar a menor caixa que consiga acomodar pelo menos um produto
        for (const c of this.caixasFakeDB.sort(
          (a, b) => this.volume(a) - this.volume(b),
        )) {
          if (produtosSobrando.some((p) => this.cabeNaCaixa(c, p.dimensoes))) {
            caixaEscolhida = c;
            break;
          }
        } // Se nenhum produto couber em nenhuma caixa
        if (!caixaEscolhida) {
          const produto = produtosSobrando.shift()!;
          caixasUsadas.push({
            caixa_id: null,
            produtos: [produto.produto_id],
            observacao: 'Produto não cabe em nenhuma caixa disponível.',
          });
          continue;
        } // Agrupa produtos que cabem nesta caixa
        const produtosNaCaixa: string[] = [];
        const indiceParaRemover: number[] = [];
        produtosSobrando.forEach((p, idx) => {
          if (this.cabeNaCaixa(caixaEscolhida!, p.dimensoes)) {
            produtosNaCaixa.push(p.produto_id);
            indiceParaRemover.push(idx);
          }
        }); // Remove produtos que já foram colocados na caixa
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
          const ordem = {
            'Caixa 3': 1,
            'Caixa 2': 2,
            'Caixa 1': 3,
            null: 0,
          };
          return (
            ordem[a.caixa_id as keyof typeof ordem] -
            ordem[b.caixa_id as keyof typeof ordem]
          );
        }),
      });
    }

    return { pedidos: resultado };
  }

  private volume(caixa: {
    altura: number;
    largura: number;
    comprimento: number;
  }) {
    return caixa.altura * caixa.largura * caixa.comprimento;
  }

  private cabeNaCaixa(
    caixa: { altura: number; largura: number; comprimento: number },
    p: { altura: number; largura: number; comprimento: number },
  ): boolean {
    const { altura: A, largura: L, comprimento: C } = caixa;
    const { altura: a, largura: l, comprimento: c } = p;

    const rotacoes = [
      [a, l, c],
      [a, c, l],
      [l, a, c],
      [l, c, a],
      [c, a, l],
      [c, l, a],
    ];

    return rotacoes.some(([ra, rl, rc]) => ra <= A && rl <= L && rc <= C);
  }
}
