import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterClientDto {
  @ApiProperty({
    example: '1234567890',
    description: 'Número de documento del cliente',
  })
  @IsNotEmpty({ message: 'El documento es requerido' })
  @IsString()
  @Length(5, 20, { message: 'El documento debe tener entre 5 y 20 caracteres' })
  @Matches(/^[0-9]+$/, { message: 'El documento solo debe contener números' })
  documento: string;

  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre completo del cliente',
  })
  @IsNotEmpty({ message: 'Los nombres son requeridos' })
  @IsString()
  @Length(3, 100, {
    message: 'Los nombres deben tener entre 3 y 100 caracteres',
  })
  nombres: string;

  @ApiProperty({ example: 'juan@email.com', description: 'Email del cliente' })
  @IsNotEmpty({ message: 'El email es requerido' })
  @IsEmail({}, { message: 'El email no es válido' })
  email: string;

  @ApiProperty({
    example: '3001234567',
    description: 'Número de celular del cliente',
  })
  @IsNotEmpty({ message: 'El celular es requerido' })
  @IsString()
  @Length(10, 15, { message: 'El celular debe tener entre 10 y 15 caracteres' })
  @Matches(/^[0-9]+$/, { message: 'El celular solo debe contener números' })
  celular: string;
}
