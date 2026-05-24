import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { NetworkService } from '../network/network.service';
import { DijkstraService } from './dijkstra.service';
import { OptimizeRouteDto } from './dto/optimize-route.dto';

@Injectable()
export class RouteService {
  constructor(
    private readonly networkService: NetworkService,
    private readonly dijkstraService: DijkstraService,
  ) {}

  optimize(networkId: string, dto: OptimizeRouteDto) {
    const network = this.networkService.findById(networkId);
    if (!network) throw new NotFoundException(`No network found with id: ${networkId}`);

    const { originNodeId, destinationNodeId, preference, constraints } = dto;
    const knownNodes = new Set(network.nodes.map((n) => n.id));

    if (!knownNodes.has(originNodeId)) {
      throw new BadRequestException(`Origin node '${originNodeId}' does not exist in this network`);
    }
    if (!knownNodes.has(destinationNodeId)) {
      throw new BadRequestException(`Destination node '${destinationNodeId}' does not exist in this network`);
    }
    if (originNodeId === destinationNodeId) {
      throw new BadRequestException('Origin and destination cannot be the same node');
    }

    const start = Date.now();
    const result = this.dijkstraService.run(network.edges, originNodeId, destinationNodeId, {
      preference,
      avoidHighways: constraints?.avoidHighways,
    });

    if (!result) {
      throw new BadRequestException(
        `No route exists between '${originNodeId}' and '${destinationNodeId}' with the given constraints`,
      );
    }

    return {
      graphId: networkId,
      totalCost: result.totalCost,
      path: result.path,
      durationMs: Date.now() - start,
    };
  }
}
