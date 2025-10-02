import { Controller, Post, Body } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { RegisterClientDto } from './dto/register-client.dto';
import { ApiResponseDto } from '../common/dto/api-response.dto';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post('register')
  async register(@Body() dto: RegisterClientDto): Promise<ApiResponseDto> {
    return this.clientsService.registerClient(dto);
  }
}
