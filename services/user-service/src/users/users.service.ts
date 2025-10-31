import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, AuthProvider } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findByProviderId(provider: AuthProvider, providerId: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        provider,
        providerId,
      },
    });
  }

  async createLocalUser(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<User> {
    // Check if user already exists
    const existingUser = await this.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    return this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        provider: AuthProvider.LOCAL,
      },
    });
  }

  async createSocialUser(data: {
    email: string;
    firstName: string;
    lastName: string;
    provider: AuthProvider;
    providerId: string;
    avatar?: string;
    providerData?: any;
  }): Promise<User> {
    // Check if user already exists by email
    let existingUser = await this.findByEmail(data.email);

    if (existingUser) {
      // If user exists but with different provider, link accounts
      if (existingUser.provider !== data.provider) {
        // Update user with new provider info
        return this.prisma.user.update({
          where: { id: existingUser.id },
          data: {
            provider: data.provider,
            providerId: data.providerId,
            avatar: data.avatar || existingUser.avatar,
            providerData: data.providerData,
            lastLoginAt: new Date(),
          },
        });
      }
      // User already exists with same provider, just update login time
      return this.prisma.user.update({
        where: { id: existingUser.id },
        data: { lastLoginAt: new Date() },
      });
    }

    // Create new social user
    return this.prisma.user.create({
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        avatar: data.avatar,
        provider: data.provider,
        providerId: data.providerId,
        providerData: data.providerData,
        lastLoginAt: new Date(),
      },
    });
  }

  async updateUser(id: string, data: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        ...data,
        providerData: data.providerData ?? undefined,
      },
    });
  }

  async validatePassword(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user || !user.password) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return user;
  }

  async getUserProfile(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        bookings: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        reviews: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
