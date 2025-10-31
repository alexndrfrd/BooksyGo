import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User, AuthProvider } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.validatePassword(email, password);
    if (user) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async validateSocialUser(
    userData: {
      email: string;
      firstName: string;
      lastName: string;
      avatar?: string;
      providerId: string;
      providerData?: any;
    },
    provider: 'GOOGLE' | 'FACEBOOK' | 'APPLE',
  ): Promise<any> {
    const providerEnum = AuthProvider[provider];
    const user = await this.usersService.createSocialUser({
      ...userData,
      provider: providerEnum,
    });

    const { password, ...result } = user;
    return result;
  }

  async login(user: User) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        points: user.points,
        level: user.level,
      },
    };
  }

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<User> {
    return this.usersService.createLocalUser(userData);
  }
}
