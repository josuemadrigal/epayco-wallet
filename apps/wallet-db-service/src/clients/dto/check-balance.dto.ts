import { IsNotEmpty, IsString } from 'class-validator';

export class CheckBalanceDto {
  @IsNotEmpty({ message: 'El documento es requerido' })
  @IsString()
  documento: string;

  @IsNotEmpty({ message: 'El celular es requerido' })
  @IsString()
  celular: string;
}
