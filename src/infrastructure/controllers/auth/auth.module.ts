import { Module } from '@nestjs/common';
import { AuthService } from '@usecases/auth/auth.service';
import { AuthController } from '@infrastructure/controllers/auth/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@domain/entities/user.interface';
import { LoggerService } from '@infrastructure/logger/logger.service';
import { ExceptionsService } from '@infrastructure/exceptions/exceptions.service';
import { UsersRepository } from '@infrastructure/repositories/users.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '@infrastructure/services/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
  ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: 3600
        }
      })
    }),
    TypeOrmModule.forFeature([User])
  ],
  controllers: [AuthController],
  providers: [AuthService, LoggerService, ExceptionsService, JwtStrategy, UsersRepository],
  exports: [JwtStrategy, PassportModule]
})
export class AuthModule {}
