import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationResolver } from './reservation.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ReservationRepository } from './reservation.repository';

@Module({
  imports: [PrismaModule],
  exports: [ReservationRepository],
  providers: [ReservationService, ReservationResolver, ReservationRepository],
})
export class ReservationModule {}
