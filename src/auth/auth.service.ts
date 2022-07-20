import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { domainToASCII } from 'url';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signup(dto: AuthDto) {
    try {
      // generate the password
      const hash = await argon.hash(dto.password);

      // save the user in the db
      const user = await this.prisma.user.create({
        data: { email: dto.email, hash },
        /** for filter data to show */
        // select: {
        //   id: true,
        //   email: true,
        //   firstName: true,
        //   createdAt: true,
        // },
      });
      delete user.hash;

      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          // for checking is data duplicated / must unique
          throw new ForbiddenException('Credentials taken');
        }
      }

      throw error;
    }
  }

  async signin(dto: AuthDto) {
    // find the user by email in database
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    // if user not exist -> throw exception
    if (!user) throw new ForbiddenException('Credetials incorrect');

    // compare password
    const pwMatches = await argon.verify(user.hash, dto.password);
    // if password incorrect -> throw exception
    if (!pwMatches) throw new ForbiddenException('Credential incorrect');

    // return the user
    delete user.hash;
    return user;
  }
}
