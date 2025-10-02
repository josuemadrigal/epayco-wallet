import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { RegisterClientDto } from './dto/register-client.dto';
import { RechargeWalletDto } from './dto/recharge-wallet.dto';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import { CheckBalanceDto } from './dto/check-balance.dto';
import { ApiResponseDto } from '../common/dto/api-response.dto';

@Injectable()
export class ClientsService {
  private readonly dbServiceUrl =
    process.env.DB_SERVICE_URL || 'http://localhost:3001';

  private async callDbService<T>(
    endpoint: string,
    data: any,
  ): Promise<ApiResponseDto<T>> {
    try {
      const response = await axios.post(
        `${this.dbServiceUrl}${endpoint}`,
        data,
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      throw new HttpException(
        'Error al comunicarse con el servicio de base de datos',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async registerClient(dto: RegisterClientDto): Promise<ApiResponseDto> {
    return this.callDbService('/clients/register', dto);
  }

  async rechargeWallet(dto: RechargeWalletDto): Promise<ApiResponseDto> {
    return this.callDbService('/clients/recharge', dto);
  }

  async initiatePayment(dto: InitiatePaymentDto): Promise<ApiResponseDto> {
    return this.callDbService('/clients/payment/initiate', dto);
  }

  async confirmPayment(dto: ConfirmPaymentDto): Promise<ApiResponseDto> {
    return this.callDbService('/clients/payment/confirm', dto);
  }

  async checkBalance(dto: CheckBalanceDto): Promise<ApiResponseDto> {
    return this.callDbService('/clients/balance', dto);
  }
}
