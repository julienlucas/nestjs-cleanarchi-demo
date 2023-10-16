import { Body, Controller, Post } from '@nestjs/common';
import { AuthCrendentialsDto } from '@infrastructure/controllers/auth/auth-credential.dto';
import { AuthService } from '@usecases/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Post('/signup')
  signUp(@Body() authCrendentialsDto: AuthCrendentialsDto): Promise<void> {
    return this.authService.signUp(authCrendentialsDto);
  }

  @Post('/signin')
  signIn(@Body() authCrendentialsDto: AuthCrendentialsDto): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCrendentialsDto);
  }
}
