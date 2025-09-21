import { ApiProperty } from '@nestjs/swagger';

export class CaixaResultDTO {
  @ApiProperty({ example: 'Caixa 1', nullable: true })
  caixa_id: string | null;

  @ApiProperty({ example: ['PS5', 'Volante'] })
  produtos: string[];

  @ApiProperty({
    example: 'Produto não cabe em nenhuma caixa disponível.',
    required: false,
  })
  observacao?: string;
}

export class PedidoResultDTO {
  @ApiProperty({ example: 1 })
  pedido_id: number;

  @ApiProperty({ type: [CaixaResultDTO] })
  caixas: CaixaResultDTO[];
}

export class PackResponseDTO {
  @ApiProperty({ type: [PedidoResultDTO] })
  pedidos: PedidoResultDTO[];
}
