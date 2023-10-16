import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from '@domain/entities/user.interface';

export const GetUser = createParamDecorator((_data, ctx: ExecutionContext): User => {
  const req = ctx.switchToHttp().getRequest();
  return req.user;
});