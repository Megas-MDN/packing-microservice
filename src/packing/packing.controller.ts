import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PackingService } from './packing.service';
import { PackRequestDTO } from './dto/pack-request.dto';
import { PackResponseDTO } from './dto/pack-response.dto';
import { Caixa } from './entities/caixa.entity';

@ApiTags('Packing')
@Controller('packing')
export class PackingController {
  constructor(private readonly packingService: PackingService) {}

  // POST -> processar pedidos
  @Post()
  processar(@Body() payload: PackRequestDTO): PackResponseDTO {
    return this.packingService.processarPedidos(payload);
  }

  // GET -> listar caixas disponíveis (fakeDB)
  @Get('/')
  listarCaixas(): Caixa[] {
    return this.packingService.getCaixas();
  }
}
