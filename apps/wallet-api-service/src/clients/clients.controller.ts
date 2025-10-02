import { Controller, Post, Body } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { RegisterClientDto } from './dto/register-client.dto';
import { RechargeWalletDto } from './dto/recharge-wallet.dto';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import { CheckBalanceDto } from './dto/check-balance.dto';
import { ApiResponseDto } from '../common/dto/api-response.dto';

@Controller('api/clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post('register')
  async register(@Body() dto: RegisterClientDto): Promise<ApiResponseDto> {
    return this.clientsService.registerClient(dto);
  }

  @Post('recharge')
  async recharge(@Body() dto: RechargeWalletDto): Promise<ApiResponseDto> {
    return this.clientsService.rechargeWallet(dto);
  }

  @Post('payment/initiate')
  async initiatePayment(
    @Body() dto: InitiatePaymentDto,
  ): Promise<ApiResponseDto> {
    return this.clientsService.initiatePayment(dto);
  }

  @Post('payment/confirm')
  async confirmPayment(
    @Body() dto: ConfirmPaymentDto,
  ): Promise<ApiResponseDto> {
    return this.clientsService.confirmPayment(dto);
  }

  @Post('balance')
  async checkBalance(@Body() dto: CheckBalanceDto): Promise<ApiResponseDto> {
    return this.clientsService.checkBalance(dto);
  }
}
