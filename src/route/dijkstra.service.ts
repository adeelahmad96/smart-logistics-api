import { Injectable } from '@nestjs/common';
import { Edge } from '../types';

interface DijkstraOptions {
  preference?: 'shortest' | 'fastest';
  avoidHighways?: boolean;
}

export interface DijkstraResult {
  path: string[];
  totalCost: number;
}

@Injectable()
export class DijkstraService {
  run(edges: Edge[], origin: string, destination: string, options: DijkstraOptions = {}): DijkstraResult | null {
    const graph = new Map<string, { neighbor: string; cost: number }[]>();

    for (const edge of edges) {
      if (options.avoidHighways && edge.isHighway) continue;

      const weight =
        options.preference === 'fastest' && edge.timeCost != null
          ? edge.timeCost
          : edge.cost;

      if (!graph.has(edge.from)) graph.set(edge.from, []);
      if (!graph.has(edge.to)) graph.set(edge.to, []);

      graph.get(edge.from)!.push({ neighbor: edge.to, cost: weight });
    }

    if (!graph.has(origin) || !graph.has(destination)) return null;

    const dist = new Map<string, number>();
    const prev = new Map<string, string | null>();
    const queue: { node: string; cost: number }[] = [];

    for (const node of graph.keys()) {
      dist.set(node, Infinity);
      prev.set(node, null);
    }

    dist.set(origin, 0);
    queue.push({ node: origin, cost: 0 });

    while (queue.length > 0) {
      queue.sort((a, b) => a.cost - b.cost);
      const curr = queue.shift()!;

      if (curr.node === destination) break;
      if (curr.cost > dist.get(curr.node)!) continue;

      for (const { neighbor, cost } of graph.get(curr.node) ?? []) {
        const next = dist.get(curr.node)! + cost;

        if (next < dist.get(neighbor)!) {
          dist.set(neighbor, next);
          prev.set(neighbor, curr.node);
          queue.push({ node: neighbor, cost: next });
        }
      }
    }

    if (dist.get(destination) === Infinity) return null;

    const path: string[] = [];
    let node: string | null = destination;
    while (node !== null) {
      path.unshift(node);
      node = prev.get(node) ?? null;
    }

    return { path, totalCost: dist.get(destination)! };
  }
}
