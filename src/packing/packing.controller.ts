import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PackingService } from './packing.service';
import { PackRequestDTO } from './dto/pack-request.dto';
import { PackResponseDTO } from './dto/pack-response.dto';

@ApiTags('Packing')
@Controller('packing')
export class PackingController {
  constructor(private readonly packingService: PackingService) {}

  @Post()
  processar(@Body() payload: PackRequestDTO): PackResponseDTO {
    return this.packingService.processarPedidos(payload);
  }
}
