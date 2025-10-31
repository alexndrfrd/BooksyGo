import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'alex@booksygo.com',
    description: 'Adresa de email a utilizatorului',
  })
  @IsEmail({}, { message: 'Email-ul nu este valid' })
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Parolă (minim 8 caractere)',
    minLength: 8,
  })
  @IsString()
  @MinLength(8, { message: 'Parola trebuie să aibă cel puțin 8 caractere' })
  password: string;

  @ApiProperty({
    example: 'Alexandru',
    description: 'Prenumele utilizatorului',
  })
  @IsString()
  @MinLength(2, { message: 'Prenumele trebuie să aibă cel puțin 2 caractere' })
  @MaxLength(50, { message: 'Prenumele nu poate depăși 50 de caractere' })
  firstName: string;

  @ApiProperty({
    example: 'Besleaga',
    description: 'Numele de familie al utilizatorului',
  })
  @IsString()
  @MinLength(2, { message: 'Numele trebuie să aibă cel puțin 2 caractere' })
  @MaxLength(50, { message: 'Numele nu poate depăși 50 de caractere' })
  lastName: string;
}

