import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { RegisterClientDto } from './dto/register-client.dto';
import { RechargeWalletDto } from './dto/recharge-wallet.dto';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import { CheckBalanceDto } from './dto/check-balance.dto';
import { ApiResponseDto } from '../common/dto/api-response.dto';

@ApiTags('clients')
@Controller('api/clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo cliente' })
  @ApiResponse({ status: 200, description: 'Cliente registrado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async register(@Body() dto: RegisterClientDto): Promise<ApiResponseDto> {
    return this.clientsService.registerClient(dto);
  }

  @Post('recharge')
  @ApiOperation({ summary: 'Recargar saldo a la billetera' })
  @ApiResponse({ status: 200, description: 'Recarga exitosa' })
  async recharge(@Body() dto: RechargeWalletDto): Promise<ApiResponseDto> {
    return this.clientsService.rechargeWallet(dto);
  }

  @Post('payment/initiate')
  @ApiOperation({ summary: 'Iniciar proceso de pago' })
  @ApiResponse({ status: 200, description: 'Token enviado al email' })
  async initiatePayment(
    @Body() dto: InitiatePaymentDto,
  ): Promise<ApiResponseDto> {
    return this.clientsService.initiatePayment(dto);
  }

  @Post('payment/confirm')
  @ApiOperation({ summary: 'Confirmar pago con token' })
  @ApiResponse({ status: 200, description: 'Pago confirmado exitosamente' })
  async confirmPayment(
    @Body() dto: ConfirmPaymentDto,
  ): Promise<ApiResponseDto> {
    return this.clientsService.confirmPayment(dto);
  }

  @Post('balance')
  @ApiOperation({ summary: 'Consultar saldo de billetera' })
  @ApiResponse({ status: 200, description: 'Saldo consultado exitosamente' })
  async checkBalance(@Body() dto: CheckBalanceDto): Promise<ApiResponseDto> {
    return this.clientsService.checkBalance(dto);
  }
}
