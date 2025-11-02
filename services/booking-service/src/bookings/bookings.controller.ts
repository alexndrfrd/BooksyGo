import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingResponseDto } from './dto/booking-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../auth/user.decorator';

@ApiTags('bookings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Creează o rezervare nouă' })
  @ApiResponse({ status: 201, description: 'Rezervare creată cu succes', type: BookingResponseDto })
  @ApiResponse({ status: 400, description: 'Date invalide' })
  @ApiResponse({ status: 401, description: 'Neautorizat' })
  async createBooking(
    @User('userId') userId: string,
    @Body() createBookingDto: CreateBookingDto,
  ): Promise<BookingResponseDto> {
    return this.bookingsService.createBooking(userId, createBookingDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obține toate rezervările utilizatorului' })
  @ApiResponse({ status: 200, description: 'Listă rezervări', type: [BookingResponseDto] })
  @ApiResponse({ status: 401, description: 'Neautorizat' })
  async getUserBookings(@User('userId') userId: string): Promise<BookingResponseDto[]> {
    return this.bookingsService.getUserBookings(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obține o rezervare specifică' })
  @ApiResponse({ status: 200, description: 'Detalii rezervare', type: BookingResponseDto })
  @ApiResponse({ status: 404, description: 'Rezervare negăsită' })
  @ApiResponse({ status: 401, description: 'Neautorizat' })
  async getBooking(
    @Param('id') id: string,
    @User('userId') userId: string,
  ): Promise<BookingResponseDto> {
    return this.bookingsService.getBookingById(id, userId);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Anulează o rezervare' })
  @ApiResponse({ status: 200, description: 'Rezervare anulată cu succes', type: BookingResponseDto })
  @ApiResponse({ status: 400, description: 'Rezervarea nu poate fi anulată' })
  @ApiResponse({ status: 404, description: 'Rezervare negăsită' })
  @ApiResponse({ status: 401, description: 'Neautorizat' })
  async cancelBooking(
    @Param('id') id: string,
    @User('userId') userId: string,
  ): Promise<BookingResponseDto> {
    return this.bookingsService.cancelBooking(id, userId);
  }
}

