import { Injectable } from '@nestjs/common';
import { RegisterClientDto } from './dto/register-client.dto';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async registerClient(dto: RegisterClientDto): Promise<ApiResponseDto> {
    try {
      // Verificar si ya existe el cliente
      const existingClient = await this.prisma.client.findFirst({
        where: {
          OR: [{ documento: dto.documento }, { email: dto.email }],
        },
      });

      if (existingClient) {
        return ApiResponseDto.error(
          'El cliente ya existe con ese documento o email',
          'CLIENT_EXISTS',
        );
      }

      // Crear el cliente
      const client = await this.prisma.client.create({
        data: {
          documento: dto.documento,
          nombres: dto.nombres,
          email: dto.email,
          celular: dto.celular,
        },
      });

      return ApiResponseDto.success('Cliente registrado exitosamente', {
        id: client.id,
        documento: client.documento,
        nombres: client.nombres,
        email: client.email,
      });
    } catch (error) {
      return ApiResponseDto.error(
        `Error al registrar el cliente: ${error.message}`,
        'REGISTER_ERROR',
      );
    }
  }
}
