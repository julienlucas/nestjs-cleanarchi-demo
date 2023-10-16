import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { jwtPayload } from '@domain/adapters/jwt-payload.interface';
import { LoggerService } from '@infrastructure/logger/logger.service';
import { ExceptionsService } from '@infrastructure/exceptions/exceptions.service';
import { UsersRepository } from '@infrastructure/repositories/users.repository';
import { AuthCrendentialsDto } from '@infrastructure/controllers/auth/auth-credential.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private readonly usersRepository: UsersRepository,
    private readonly exception: ExceptionsService,
    private readonly logger: LoggerService,
    private readonly jwtService: JwtService
  ) {}

  async signUp(authCrendentialsDto: AuthCrendentialsDto): Promise<void> {
    const result = await this.usersRepository.createUser(authCrendentialsDto);

    this.logger.verbose('authUsecases execute', `User created successfully`);
    return result;
  }

  async signIn(authCrendentialsDto: AuthCrendentialsDto): Promise<{ accessToken: string }> {
    const { username, password } = authCrendentialsDto;
    const user = await this.usersRepository.findOne({ where: { username } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: jwtPayload = { username };
      const accessToken: string = await this.jwtService.sign(payload);

      this.logger.verbose('authUsecases execute', `User signin successfully`);
      return { accessToken };
    } else {
      const message = 'Please check your login credentials';
      this.logger.error(message, 'Code_error: 401');
      throw this.exception.UnauthorizedException({ message, code_error: 401 });
    }
  }
}
