import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { RegisterClientDto } from './dto/register-client.dto';
import { RechargeWalletDto } from './dto/recharge-wallet.dto';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import { CheckBalanceDto } from './dto/check-balance.dto';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ClientsService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  private generateToken(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private validateAmount(amount: number): void {
    if (amount <= 0) {
      throw new BadRequestException('El monto debe ser mayor a 0');
    }
    if (amount > 10000000) {
      throw new BadRequestException('El monto excede el límite permitido');
    }
  }

  async registerClient(dto: RegisterClientDto): Promise<ApiResponseDto> {
    try {
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

      const client = await this.prisma.client.create({
        data: {
          documento: dto.documento,
          nombres: dto.nombres,
          email: dto.email,
          celular: dto.celular,
        },
      });

      // Enviar email de bienvenida (opcional, no bloquea el registro)
      this.emailService
        .sendWelcomeEmail(client.email, client.nombres)
        .catch((error) =>
          console.error('Error enviando email de bienvenida:', error),
        );

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
    this.validateAmount(dto.valor);

    try {
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

      // Enviar email de confirmación de recarga
      this.emailService
        .sendRechargeConfirmation(
          client.email,
          client.nombres,
          dto.valor,
          Number(updatedClient.saldo),
        )
        .catch((error) =>
          console.error('Error enviando email de recarga:', error),
        );

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

  async initiatePayment(dto: InitiatePaymentDto): Promise<ApiResponseDto> {
    this.validateAmount(dto.valor);

    try {
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

      if (Number(client.saldo) < dto.valor) {
        return ApiResponseDto.error(
          'Saldo insuficiente',
          'INSUFFICIENT_BALANCE',
        );
      }

      const token = this.generateToken();
      const sessionId = uuidv4();
      const tokenExpira = new Date();
      tokenExpira.setMinutes(tokenExpira.getMinutes() + 10);

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

      // Enviar email con el token
      const emailSent = await this.emailService.sendPaymentToken(
        client.email,
        client.nombres,
        token,
        dto.valor,
      );

      if (!emailSent) {
        // Si falla el envío del email, aún mostramos el token en consola como fallback
        console.log(`📧 Token para ${client.email}: ${token}`);
        return ApiResponseDto.success(
          'Token generado. NOTA: Hubo un problema al enviar el email. Revisa la consola del servidor.',
          {
            sessionId,
            email: client.email,
            tokenFallback: token, // Solo en desarrollo
          },
        );
      }

      return ApiResponseDto.success(
        'Se ha enviado un token de confirmación a tu email',
        {
          sessionId,
          email: client.email,
        },
      );
    } catch (error) {
      console.error('Error en initiatePayment:', error);
      return ApiResponseDto.error(
        'Error al iniciar el pago',
        'PAYMENT_INIT_ERROR',
      );
    }
  }

  async confirmPayment(dto: ConfirmPaymentDto): Promise<ApiResponseDto> {
    try {
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

      if (transaction.estado !== 'pendiente') {
        return ApiResponseDto.error(
          'Esta transacción ya fue procesada',
          'TRANSACTION_ALREADY_PROCESSED',
        );
      }

      if (!transaction.tokenExpira || new Date() > transaction.tokenExpira) {
        await this.prisma.transaction.update({
          where: { id: transaction.id },
          data: { estado: 'fallida' },
        });

        // Enviar email de pago fallido (token expirado)
        this.emailService
          .sendPaymentConfirmation(
            transaction.client.email,
            transaction.client.nombres,
            Number(transaction.monto),
            Number(transaction.client.saldo),
            false,
          )
          .catch((error) =>
            console.error('Error enviando email de pago fallido:', error),
          );

        return ApiResponseDto.error('El token ha expirado', 'TOKEN_EXPIRED');
      }

      if (transaction.token !== dto.token) {
        // Enviar email de pago fallido (token inválido)
        this.emailService
          .sendPaymentConfirmation(
            transaction.client.email,
            transaction.client.nombres,
            Number(transaction.monto),
            Number(transaction.client.saldo),
            false,
          )
          .catch((error) =>
            console.error('Error enviando email de pago fallido:', error),
          );

        return ApiResponseDto.error('Token inválido', 'INVALID_TOKEN');
      }

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

      // Enviar email de pago exitoso
      this.emailService
        .sendPaymentConfirmation(
          transaction.client.email,
          transaction.client.nombres,
          Number(transaction.monto),
          Number(updatedClient.saldo),
          true,
        )
        .catch((error) =>
          console.error('Error enviando email de pago exitoso:', error),
        );

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

  async checkBalance(dto: CheckBalanceDto): Promise<ApiResponseDto> {
    try {
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

      return ApiResponseDto.success('Consulta exitosa', {
        nombres: client.nombres,
        saldo: client.saldo,
      });
    } catch (error) {
      return ApiResponseDto.error(
        `Error al consultar el saldo: ${error.message}`,
        'BALANCE_CHECK_ERROR',
      );
    }
  }
}
