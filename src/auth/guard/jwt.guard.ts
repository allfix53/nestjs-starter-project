import { AuthGuard } from '@nestjs/passport';

// 'jwt' called from JwtStrategy extends PassportStrategy
// jwt.startegy.ts
export class JwtGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
}
