import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PackingService } from './packing.service';
import { PackRequestDTO } from './dto/pack-request.dto';
import { PackResponseDTO } from './dto/pack-response.dto';
import { Caixa } from './entities/caixa.entity';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Packing')
@Controller('packing')
export class PackingController {
  constructor(private readonly packingService: PackingService) {}

  @Post()
  @HttpCode(200)
  processar(@Body() payload: PackRequestDTO): PackResponseDTO {
    return this.packingService.processarPedidos(payload);
  }

  @Get('/')
  listarCaixas(): Caixa[] {
    return this.packingService.getCaixas();
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Rota protegida' })
  @ApiResponse({ status: 200, description: 'Acesso autorizado.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @Get('/secure')
  rotaProtegida() {
    return { message: 'Você acessou uma rota protegida com sucesso!' };
  }
}
