import { ApiProperty } from '@nestjs/swagger';

class UserResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'alex@booksygo.com' })
  email: string;

  @ApiProperty({ example: 'Alexandru' })
  firstName: string;

  @ApiProperty({ example: 'Besleaga' })
  lastName: string;

  @ApiProperty({ example: 'LOCAL', enum: ['LOCAL', 'GOOGLE', 'FACEBOOK', 'APPLE'] })
  provider: string;

  @ApiProperty({ example: 'USER', enum: ['USER', 'ADMIN'] })
  role: string;

  @ApiProperty({ example: 0 })
  points: number;

  @ApiProperty({ example: 1 })
  level: number;

  @ApiProperty({ example: '2025-10-30T18:00:00.000Z' })
  createdAt: Date;
}

export class AuthResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token',
  })
  access_token: string;

  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;
}

