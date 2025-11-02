import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsDateString } from 'class-validator';

export enum BookingType {
  FLIGHT = 'FLIGHT',
  HOTEL = 'HOTEL',
  PACKAGE = 'PACKAGE',
}

export class CreateBookingDto {
  @ApiProperty({ enum: BookingType, example: 'FLIGHT', description: 'Tipul rezervării' })
  @IsEnum(BookingType)
  @IsNotEmpty()
  bookingType: BookingType;

  @ApiProperty({ example: {}, description: 'Date despre zbor (dacă type e FLIGHT)', required: false })
  @IsObject()
  @IsOptional()
  flightData?: any;

  @ApiProperty({ example: {}, description: 'Date despre hotel (dacă type e HOTEL)', required: false })
  @IsObject()
  @IsOptional()
  hotelData?: any;

  @ApiProperty({ example: {}, description: 'Date despre pachet (dacă type e PACKAGE)', required: false })
  @IsObject()
  @IsOptional()
  packageData?: any;

  @ApiProperty({ example: {}, description: 'Date despre pasager/oaspete' })
  @IsObject()
  @IsNotEmpty()
  passengerData: any;

  @ApiProperty({ example: 150, description: 'Preț total' })
  @IsNumber()
  @IsNotEmpty()
  totalPrice: number;

  @ApiProperty({ example: 'EUR', description: 'Moneda', default: 'EUR' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({ example: {}, description: 'Date despre plată', required: false })
  @IsObject()
  @IsOptional()
  paymentData?: any;

  @ApiProperty({ example: '2025-11-15', description: 'Data călătoriei (pentru zboruri)', required: false })
  @IsDateString()
  @IsOptional()
  travelDate?: string;

  @ApiProperty({ example: '2025-11-15', description: 'Data check-in (pentru hoteluri)', required: false })
  @IsDateString()
  @IsOptional()
  checkInDate?: string;

  @ApiProperty({ example: '2025-11-17', description: 'Data check-out (pentru hoteluri)', required: false })
  @IsDateString()
  @IsOptional()
  checkOutDate?: string;

  @ApiProperty({ example: 0, description: 'Puncte folosite din BooksyPoints', default: 0 })
  @IsNumber()
  @IsOptional()
  pointsUsed?: number;
}

