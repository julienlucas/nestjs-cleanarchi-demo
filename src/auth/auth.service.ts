import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCrendentialsDto } from './dto/auth-credential.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { jwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private jwtService: JwtService
  ) {}

  async signUp(authCrendentialsDto: AuthCrendentialsDto): Promise<void> {
    return this.usersRepository.createUser(authCrendentialsDto);
  }

  async signIn(authCrendentialsDto: AuthCrendentialsDto): Promise<{ accessToken: string }> {
    const { username, password } = authCrendentialsDto;
    const user = await this.usersRepository.findOne({ where: { username } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: jwtPayload = { username };
      const accessToken: string = await this.jwtService.sign(payload);

      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }
}
