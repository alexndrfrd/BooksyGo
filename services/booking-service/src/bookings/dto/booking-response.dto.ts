import { ApiProperty } from '@nestjs/swagger';

export class BookingResponseDto {
  @ApiProperty({ example: 'clx000000000000000000000', description: 'ID rezervare' })
  id: string;

  @ApiProperty({ example: 'clx000000000000000000001', description: 'ID utilizator' })
  userId: string;

  @ApiProperty({ example: 'FLIGHT', description: 'Tip rezervare' })
  bookingType: string;

  @ApiProperty({ example: 'CONFIRMED', description: 'Status rezervare' })
  status: string;

  @ApiProperty({ example: {}, description: 'Date zbor/hotel/pachet' })
  data: any;

  @ApiProperty({ example: {}, description: 'Date pasager/oaspete' })
  passengerData: any;

  @ApiProperty({ example: 'PAID', description: 'Status plată' })
  paymentStatus: string;

  @ApiProperty({ example: 150, description: 'Preț total' })
  totalPrice: number;

  @ApiProperty({ example: 'EUR', description: 'Monedă' })
  currency: string;

  @ApiProperty({ example: 50, description: 'Puncte câștigate' })
  pointsEarned: number;

  @ApiProperty({ example: 0, description: 'Puncte folosite' })
  pointsUsed: number;

  @ApiProperty({ example: '2025-11-01T10:00:00.000Z', description: 'Data rezervării' })
  bookingDate: Date;

  @ApiProperty({ example: '2025-11-01T10:00:00.000Z', description: 'Creat la' })
  createdAt: Date;
}

