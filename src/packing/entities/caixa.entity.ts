import { ApiProperty } from '@nestjs/swagger';

export class Caixa {
  @ApiProperty({ example: 'Caixa 1' })
  id: string;

  @ApiProperty({ example: 40 })
  altura: number;

  @ApiProperty({ example: 40 })
  largura: number;

  @ApiProperty({ example: 40 })
  comprimento: number;
}
