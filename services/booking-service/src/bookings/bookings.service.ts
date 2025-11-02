import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingStatus, PaymentStatus, BookingType as PrismaBookingType } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async createBooking(userId: string, createBookingDto: CreateBookingDto) {
    const {
      bookingType,
      flightData,
      hotelData,
      packageData,
      passengerData,
      totalPrice,
      currency = 'EUR',
      paymentData,
      travelDate,
      checkInDate,
      checkOutDate,
      pointsUsed = 0,
    } = createBookingDto;

    // Calculate points earned (5% of price = points)
    const pointsEarned = Math.floor(totalPrice * 0.05);

    // Determine which data to use based on booking type
    let data: any = {};
    if (bookingType === 'FLIGHT' && flightData) {
      data = flightData;
    } else if (bookingType === 'HOTEL' && hotelData) {
      data = hotelData;
    } else if (bookingType === 'PACKAGE' && packageData) {
      data = packageData;
    }

    // Create booking
    const booking = await this.prisma.booking.create({
      data: {
        userId,
        bookingType: bookingType as PrismaBookingType,
        status: BookingStatus.CONFIRMED,
        flightData: bookingType === 'FLIGHT' ? data : null,
        hotelData: bookingType === 'HOTEL' ? data : null,
        packageData: bookingType === 'PACKAGE' ? data : null,
        passengerData,
        paymentStatus: PaymentStatus.PAID,
        totalPrice,
        currency,
        paymentData,
        travelDate: travelDate ? new Date(travelDate) : null,
        checkInDate: checkInDate ? new Date(checkInDate) : null,
        checkOutDate: checkOutDate ? new Date(checkOutDate) : null,
        pointsEarned,
        pointsUsed,
      },
    });

    return this.formatBookingResponse(booking);
  }

  async getUserBookings(userId: string) {
    const bookings = await this.prisma.booking.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return bookings.map(booking => this.formatBookingResponse(booking));
  }

  async getBookingById(id: string, userId: string) {
    const booking = await this.prisma.booking.findFirst({
      where: { id, userId },
    });

    if (!booking) {
      throw new NotFoundException('Rezervarea nu a fost găsită');
    }

    return this.formatBookingResponse(booking);
  }

  async cancelBooking(id: string, userId: string) {
    const booking = await this.prisma.booking.findFirst({
      where: { id, userId },
    });

    if (!booking) {
      throw new NotFoundException('Rezervarea nu a fost găsită');
    }

    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Rezervarea este deja anulată');
    }

    if (booking.status === BookingStatus.COMPLETED) {
      throw new BadRequestException('Nu poți anula o rezervare completată');
    }

    const updatedBooking = await this.prisma.booking.update({
      where: { id },
      data: {
        status: BookingStatus.CANCELLED,
        cancelledAt: new Date(),
      },
    });

    return this.formatBookingResponse(updatedBooking);
  }

  private formatBookingResponse(booking: any) {
    // Determine which data to return based on booking type
    let data: any = null;
    if (booking.bookingType === 'FLIGHT' && booking.flightData) {
      data = booking.flightData;
    } else if (booking.bookingType === 'HOTEL' && booking.hotelData) {
      data = booking.hotelData;
    } else if (booking.bookingType === 'PACKAGE' && booking.packageData) {
      data = booking.packageData;
    }

    return {
      id: booking.id,
      userId: booking.userId,
      bookingType: booking.bookingType,
      status: booking.status,
      data,
      passengerData: booking.passengerData,
      paymentStatus: booking.paymentStatus,
      totalPrice: booking.totalPrice,
      currency: booking.currency,
      pointsEarned: booking.pointsEarned,
      pointsUsed: booking.pointsUsed,
      travelDate: booking.travelDate,
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate,
      bookingDate: booking.bookingDate,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
      cancelledAt: booking.cancelledAt,
      completedAt: booking.completedAt,
    };
  }
}

