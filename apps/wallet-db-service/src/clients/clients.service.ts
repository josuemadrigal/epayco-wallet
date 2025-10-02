import { Injectable } from '@nestjs/common';
import { RegisterClientDto } from './dto/register-client.dto';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RechargeWalletDto } from './dto/recharge-wallet.dto';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import { v4 as uuidv4 } from 'uuid';

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

  async rechargeWallet(dto: RechargeWalletDto): Promise<ApiResponseDto> {
    try {
      // Buscar cliente
      const client = await this.prisma.client.findFirst({
        where: {
          documento: dto.documento,
          celular: dto.celular,
        },
      });

      if (!client) {
        return ApiResponseDto.error(
          'Cliente no encontrado o datos incorrectos',
          'CLIENT_NOT_FOUND',
        );
      }

      // Actualizar saldo y crear transacción
      const [updatedClient] = await this.prisma.$transaction([
        this.prisma.client.update({
          where: { id: client.id },
          data: {
            saldo: {
              increment: dto.valor,
            },
          },
        }),
        this.prisma.transaction.create({
          data: {
            clientId: client.id,
            tipo: 'recarga',
            monto: dto.valor,
            estado: 'completada',
          },
        }),
      ]);

      return ApiResponseDto.success('Recarga exitosa', {
        nuevoSaldo: updatedClient.saldo,
      });
    } catch (error) {
      return ApiResponseDto.error(
        `Error al realizar la recarga: ${error.message}`,
        'RECHARGE_ERROR',
      );
    }
  }

  private generateToken(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async initiatePayment(dto: InitiatePaymentDto): Promise<ApiResponseDto> {
    try {
      // Buscar cliente
      const client = await this.prisma.client.findFirst({
        where: {
          documento: dto.documento,
          celular: dto.celular,
        },
      });

      if (!client) {
        return ApiResponseDto.error(
          'Cliente no encontrado o datos incorrectos',
          'CLIENT_NOT_FOUND',
        );
      }

      // Verificar saldo suficiente
      if (Number(client.saldo) < dto.valor) {
        return ApiResponseDto.error(
          'Saldo insuficiente',
          'INSUFFICIENT_BALANCE',
        );
      }

      // Generar token y session ID
      const token = this.generateToken();
      const sessionId = uuidv4();
      const tokenExpira = new Date();
      tokenExpira.setMinutes(tokenExpira.getMinutes() + 10); // Token válido por 10 minutos

      // Crear transacción pendiente
      await this.prisma.transaction.create({
        data: {
          clientId: client.id,
          tipo: 'compra',
          monto: dto.valor,
          estado: 'pendiente',
          sessionId,
          token,
          tokenExpira,
        },
      });

      // Aquí deberías enviar el email con el token
      console.log(`📧 Token para ${client.email}: ${token}`);

      return ApiResponseDto.success(
        'Se ha enviado un token de confirmación a tu email',
        {
          sessionId,
          email: client.email,
        },
      );
    } catch (error) {
      return ApiResponseDto.error(
        `Error al iniciar el pago: ${error.message}`,
        'PAYMENT_INIT_ERROR',
      );
    }
  }

  async confirmPayment(dto: ConfirmPaymentDto): Promise<ApiResponseDto> {
    try {
      // Buscar la transacción
      const transaction = await this.prisma.transaction.findUnique({
        where: {
          sessionId: dto.sessionId,
        },
        include: {
          client: true,
        },
      });

      if (!transaction) {
        return ApiResponseDto.error(
          'Sesión no encontrada',
          'SESSION_NOT_FOUND',
        );
      }

      // Verificar si ya fue procesada
      if (transaction.estado !== 'pendiente') {
        return ApiResponseDto.error(
          'Esta transacción ya fue procesada',
          'TRANSACTION_ALREADY_PROCESSED',
        );
      }

      // Verificar si el token expiró
      if (!transaction.tokenExpira || new Date() > transaction.tokenExpira) {
        await this.prisma.transaction.update({
          where: { id: transaction.id },
          data: { estado: 'fallida' },
        });

        return ApiResponseDto.error('El token ha expirado', 'TOKEN_EXPIRED');
      }

      // Verificar el token
      if (transaction.token !== dto.token) {
        return ApiResponseDto.error('Token inválido', 'INVALID_TOKEN');
      }

      // Descontar saldo y actualizar transacción
      const [updatedClient] = await this.prisma.$transaction([
        this.prisma.client.update({
          where: { id: transaction.clientId },
          data: {
            saldo: {
              decrement: Number(transaction.monto),
            },
          },
        }),
        this.prisma.transaction.update({
          where: { id: transaction.id },
          data: { estado: 'completada' },
        }),
      ]);

      return ApiResponseDto.success('Pago realizado exitosamente', {
        nuevoSaldo: updatedClient.saldo,
        monto: transaction.monto,
      });
    } catch (error) {
      return ApiResponseDto.error(
        `Error al confirmar el pago: ${error.message}`,
        'PAYMENT_CONFIRM_ERROR',
      );
    }
  }
}
