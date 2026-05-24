import { Module } from '@nestjs/common';
import { RouteController } from './route.controller';
import { RouteService } from './route.service';
import { DijkstraService } from './dijkstra.service';
import { NetworkModule } from '../network/network.module';

@Module({
  imports: [NetworkModule],
  controllers: [RouteController],
  providers: [RouteService, DijkstraService],
})
export class RouteModule {}
