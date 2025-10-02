import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterClientDto {
  @IsNotEmpty({ message: 'El documento es requerido' })
  @IsString()
  documento: string;

  @IsNotEmpty({ message: 'Los nombres son requeridos' })
  @IsString()
  nombres: string;

  @IsNotEmpty({ message: 'El email es requerido' })
  @IsEmail({}, { message: 'El email no es válido' })
  email: string;

  @IsNotEmpty({ message: 'El celular es requerido' })
  @IsString()
  celular: string;
}
