import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) { }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async generateToken(userId: number): Promise<string> {
    return this.jwtService.sign({ userId }, { expiresIn: '24h' });
  }

  async register(body: CreateUserDto): Promise<{ token: string }> {
    const { email, password, name } = body;
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new UnauthorizedException('error.user_exists');
    }

    const hashedPassword = await this.hashPassword(password);
    const user = await this.prisma.user.create({
      data: { email, password: hashedPassword, name },
    });
    const token = await this.generateToken(user.id);
    return { token };
  }

  async login(email: string, password: string): Promise<{ token: string }> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = await this.generateToken(user.id);
    return { token };
  }

  async validateToken(token: string): Promise<any> {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.prisma.user.findUnique({
        where: { id: payload.userId }
      });
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
