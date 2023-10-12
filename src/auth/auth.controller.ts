import { Body, Controller, Post } from '@nestjs/common';
import { AuthCrendentialsDto } from './dto/auth-credential.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() authCrendentialsDto: AuthCrendentialsDto): Promise<void> {
    return this.authService.signUp(authCrendentialsDto);
  }
}
