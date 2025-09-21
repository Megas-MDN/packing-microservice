import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class DimensoesDTO {
  @ApiProperty({ example: 40, description: 'Altura em cm' })
  @IsNumber()
  altura: number;

  @ApiProperty({ example: 10, description: 'Largura em cm' })
  @IsNumber()
  largura: number;

  @ApiProperty({ example: 25, description: 'Comprimento em cm' })
  @IsNumber()
  comprimento: number;
}

export class ProdutoDTO {
  @ApiProperty({ example: 'PS5' })
  @IsString()
  produto_id: string;

  @ApiProperty({ type: DimensoesDTO })
  @ValidateNested()
  @Type(() => DimensoesDTO)
  dimensoes: DimensoesDTO;
}

export class PedidoDTO {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  pedido_id: number;

  @ApiProperty({ type: [ProdutoDTO] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProdutoDTO)
  produtos: ProdutoDTO[];
}

export class PackRequestDTO {
  @ApiProperty({ type: [PedidoDTO] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PedidoDTO)
  pedidos: PedidoDTO[];
}
