import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from 'libs/api/feature-user/src/lib/user.service';
import * as bcrypt from 'bcrypt';
import {
  FindFirstUserArgs,
  // FindUniqueUserArgs,
} from 'libs/api/generated-db-types/src/lib';
import { PrismaService } from 'libs/api/data-access-api/src';
import { LoginUserInput } from './dto/login-user';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const userResponse = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!userResponse?.password) {
      throw new BadRequestException();
    }
    const isValid = await bcrypt.compare(password, userResponse?.password);
    if (isValid) {
      const { password: pass, ...result } = userResponse;
      return {
        user: result,
      };
    }
    return null;
  }

  async login(loginUserInput: LoginUserInput) {
    const userResponse = await this.prisma.user.findUnique({
      where: { email: loginUserInput.email },
    });
    const result = {
      email: userResponse?.email,
      id: userResponse?.id,
      name: userResponse?.name,
    };
    return {
      access_token: this.jwtService.sign({ name: result.name, sub: result.id }),
      user: result,
    };
  }
}
