import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class InitiatePaymentDto {
  @IsNotEmpty({ message: 'El documento es requerido' })
  @IsString()
  documento: string;

  @IsNotEmpty({ message: 'El celular es requerido' })
  @IsString()
  celular: string;

  @IsNotEmpty({ message: 'El valor es requerido' })
  @IsNumber({}, { message: 'El valor debe ser un número' })
  @Min(1, { message: 'El valor debe ser mayor a 0' })
  valor: number;
}
