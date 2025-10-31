import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'alex@booksygo.com',
    description: 'Adresa de email a utilizatorului',
  })
  @IsEmail({}, { message: 'Email-ul nu este valid' })
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Parola utilizatorului',
  })
  @IsString()
  @MinLength(1, { message: 'Parola este obligatorie' })
  password: string;
}

