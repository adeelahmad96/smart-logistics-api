import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Network } from '../types';
import { UploadNetworkDto } from './dto/upload-network.dto';

const MAX_NETWORKS = 5;

@Injectable()
export class NetworkService {
  private networks = new Map<string, Network>();
  private order: string[] = [];

  upload(dto: UploadNetworkDto) {
    const nodeIds = new Set<string>();
    for (const edge of dto.edges) {
      nodeIds.add(edge.from);
      nodeIds.add(edge.to);
    }

    const network: Network = {
      id: uuidv4(),
      nodes: Array.from(nodeIds).map((id) => ({ id })),
      edges: dto.edges,
      createdAt: new Date(),
    };

    if (this.networks.size >= MAX_NETWORKS) {
      const oldest = this.order.shift()!;
      this.networks.delete(oldest);
    }

    this.networks.set(network.id, network);
    this.order.push(network.id);

    return {
      id: network.id,
      message: 'Network uploaded successfully',
      nodeCount: network.nodes.length,
      edgeCount: network.edges.length,
    };
  }

  findById(id: string): Network | undefined {
    return this.networks.get(id);
  }
}
