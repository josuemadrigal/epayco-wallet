import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule } from './clients/clients.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [ClientsModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
