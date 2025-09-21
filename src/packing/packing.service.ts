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
      let produtosRestantes = [...pedido.produtos];

      // Continua até alocar todos os produtos
      while (produtosRestantes.length > 0) {
        // Escolhe a caixa que consegue empacotar o MAIOR número de produtos
        let bestBox: Caixa | null = null;
        let bestCount = 0;
        let bestVolume = Number.MAX_SAFE_INTEGER;

        for (const c of this.caixasFakeDB) {
          const count = this.simulatePackCount(c, produtosRestantes);
          if (
            count > bestCount ||
            (count === bestCount && this.volume(c) < bestVolume)
          ) {
            bestCount = count;
            bestBox = c;
            bestVolume = this.volume(c);
          }
        }

        // Se nenhuma caixa empacota pelo menos 1 produto consecutivo,
        // tratamos o primeiro produto como "não coube" (ou colocamos na menor caixa que cabe individualmente)
        if (!bestBox || bestCount === 0) {
          const produto = produtosRestantes.shift()!;
          // tenta encontrar caixa que comporta o produto individualmente
          const candidate = this.caixasFakeDB.find((c) =>
            this.cabeNaCaixa(c, produto.dimensoes),
          );
          if (!candidate) {
            caixasUsadas.push({
              caixa_id: null,
              produtos: [produto.produto_id],
              observacao: 'Produto não cabe em nenhuma caixa disponível.',
            });
          } else {
            // cabe individualmente — colocamos na menor caixa que comporta (evita null)
            const menor = [...this.caixasFakeDB]
              .filter((c) => this.cabeNaCaixa(c, produto.dimensoes))
              .sort((a, b) => this.volume(a) - this.volume(b))[0];
            caixasUsadas.push({
              caixa_id: menor.id,
              produtos: [produto.produto_id],
            });
          }
          continue;
        }

        // Se encontramos a melhor caixa que comporta bestCount produtos,
        // empacotamos os primeiros bestCount produtos (mantendo ordem)
        const produtosParaCaixa = produtosRestantes.slice(0, bestCount);
        caixasUsadas.push({
          caixa_id: bestBox.id,
          produtos: produtosParaCaixa.map((p) => p.produto_id),
        });

        // remove os empacotados
        produtosRestantes = produtosRestantes.slice(bestCount);
      }

      // Ordenação final das caixas: C3 > C2 > C1 > null
      caixasUsadas.sort((a, b) => {
        const ordem = { 'Caixa 3': 1, 'Caixa 2': 2, 'Caixa 1': 3, null: 4 };
        return (
          ordem[a.caixa_id as keyof typeof ordem] -
          ordem[b.caixa_id as keyof typeof ordem]
        );
      });

      resultado.push({
        pedido_id: pedido.pedido_id,
        caixas: caixasUsadas,
      });
    }

    console.log('resultado', JSON.stringify(resultado, null, 2), 'x---x');
    return { pedidos: resultado };
  }

  /**
   * Retorna quantos produtos consecutivos (do começo do array `produtos`)
   * podem ser alocados na caixa usando uma heurística "shelf" (linhas na base LxC),
   * preservando ordem. Usa rotações e respeita altura.
   */
  private simulatePackCount(
    caixa: Caixa,
    produtos: {
      produto_id: string;
      dimensoes: { altura: number; largura: number; comprimento: number };
    }[],
  ): number {
    const L = caixa.largura; // largura da base
    const C = caixa.comprimento; // comprimento da base
    const A = caixa.altura; // altura

    let totalUsedLength = 0; // comprimento já usado (soma das alturas das prateleiras)
    let currentRowRemainingWidth = L;
    let currentRowHeight = 0;
    let count = 0;

    for (let i = 0; i < produtos.length; i++) {
      const p = produtos[i];
      // gera rotações que cabem em altura e também não excedem base em qualquer dimensão
      const rotations = this.getRotations(p.dimensoes).filter(
        (r) => r.altura <= A && r.largura <= L && r.comprimento <= C,
      );

      if (rotations.length === 0) {
        break; // produto não cabe nem sozinho na caixa
      }

      // tenta colocar na linha atual (greedy: escolhe rotação com menor largura que caiba)
      // ordenamos por largura crescente para tentar acomodar mais itens na linha
      const rotSorted = rotations.slice().sort((a, b) => a.largura - b.largura);

      let placed = false;
      for (const r of rotSorted) {
        // cabe na linha atual sem ultrapassar o comprimento total disponível
        if (
          r.largura <= currentRowRemainingWidth &&
          r.comprimento <= C - totalUsedLength
        ) {
          currentRowRemainingWidth -= r.largura;
          currentRowHeight = Math.max(currentRowHeight, r.comprimento);
          placed = true;
          break;
        }
      }

      if (!placed) {
        // inicia nova linha (prateleira)
        totalUsedLength += currentRowHeight;
        if (totalUsedLength >= C) {
          break; // não cabe nova linha
        }

        // escolher rotação que caiba na nova linha (largura <= L e comprimento <= comprimento_restante)
        const comprimentoRestante = C - totalUsedLength;
        const candidatesNewRow = rotSorted.filter(
          (r) => r.largura <= L && r.comprimento <= comprimentoRestante,
        );
        if (candidatesNewRow.length === 0) {
          break; // não há rotação que caiba na nova linha
        }
        const chosen = candidatesNewRow[0]; // menor largura
        currentRowRemainingWidth = L - chosen.largura;
        currentRowHeight = chosen.comprimento;
        placed = true;
      }

      if (!placed) break;

      count++;
    }

    return count;
  }

  /** Gera as 6 rotações (altura, largura, comprimento) */
  private getRotations(d: {
    altura: number;
    largura: number;
    comprimento: number;
  }): { altura: number; largura: number; comprimento: number }[] {
    const { altura: a, largura: l, comprimento: c } = d;
    return [
      { altura: a, largura: l, comprimento: c },
      { altura: a, largura: c, comprimento: l },
      { altura: l, largura: a, comprimento: c },
      { altura: l, largura: c, comprimento: a },
      { altura: c, largura: a, comprimento: l },
      { altura: c, largura: l, comprimento: a },
    ];
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
