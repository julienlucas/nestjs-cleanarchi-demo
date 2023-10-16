import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiExtraModels, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthCrendentialsDto } from '@infrastructure/controllers/auth/auth-credential.dto';
import { AuthService } from '@usecases/auth/auth.service';
import { User, BearerToken } from '@domain/entities/user.interface';

@Controller('auth')
@ApiTags('Auth')
@ApiResponse({
  status: 401,
  description: 'No authorization token was found',
})
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(User)
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Post('/signup')
  @ApiBody({
    type: AuthCrendentialsDto,
    description: 'Json structure for user object',
  })
  @ApiOperation({ description: 'signup' })
  @ApiResponse({ status: 200 })
  signUp(@Body() authCrendentialsDto: AuthCrendentialsDto): Promise<void> {
    return this.authService.signUp(authCrendentialsDto);
  }

  @Post('/signin')
  @ApiBearerAuth()
  @ApiBody({
    type: AuthCrendentialsDto,
    description: 'Json structure for user object',
  })
  @ApiOperation({ description: 'login' })
  @ApiResponse({ status: 200, type: BearerToken, isArray: false })
  signIn(@Body() authCrendentialsDto: AuthCrendentialsDto): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCrendentialsDto);
  }
}
