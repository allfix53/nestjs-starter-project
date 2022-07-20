import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // to make this module available in all the module
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
