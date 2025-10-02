import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmPaymentDto {
  @IsNotEmpty({ message: 'El sessionId es requerido' })
  @IsString()
  sessionId: string;

  @IsNotEmpty({ message: 'El token es requerido' })
  @IsString()
  token: string;
}
