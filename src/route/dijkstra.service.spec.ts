import { DijkstraService } from './dijkstra.service';
import { Edge } from '../types';

const sampleEdges: Edge[] = [
  { from: 'A', to: 'B', cost: 10 },
  { from: 'A', to: 'C', cost: 5 },
  { from: 'B', to: 'D', cost: 8 },
  { from: 'C', to: 'D', cost: 12 },
  { from: 'D', to: 'E', cost: 12 },
  { from: 'D', to: 'F', cost: 4 },
  { from: 'F', to: 'G', cost: 4 },
  { from: 'E', to: 'G', cost: 9 },
  { from: 'C', to: 'H', cost: 8 },
  { from: 'D', to: 'H', cost: 4 },
  { from: 'F', to: 'H', cost: 1 },
];

describe('DijkstraService', () => {
  let service: DijkstraService;

  beforeEach(() => {
    service = new DijkstraService();
  });

  it('returns the shortest path A -> E', () => {
    const result = service.run(sampleEdges, 'A', 'E');
    expect(result).not.toBeNull();
    expect(result!.totalCost).toBe(29);
    expect(result!.path).toEqual(['A', 'C', 'D', 'E']);
  });

  it('returns the shortest path A -> G', () => {
    const result = service.run(sampleEdges, 'A', 'G');
    expect(result).not.toBeNull();
    expect(result!.totalCost).toBe(25);
    expect(result!.path).toEqual(['A', 'C', 'D', 'F', 'G']);
  });

  it('returns the shortest path A -> H', () => {
    const result = service.run(sampleEdges, 'A', 'H');
    expect(result).not.toBeNull();
    expect(result!.totalCost).toBe(13);
    expect(result!.path).toEqual(['A', 'C', 'H']);
  });

  it('returns null for unknown origin', () => {
    expect(service.run(sampleEdges, 'Z', 'E')).toBeNull();
  });

  it('returns null for unknown destination', () => {
    expect(service.run(sampleEdges, 'A', 'Z')).toBeNull();
  });

  it('returns null when destination is unreachable', () => {
    const edges = [...sampleEdges, { from: 'X', to: 'Y', cost: 5 }];
    expect(service.run(edges, 'A', 'Y')).toBeNull();
  });

  it('returns null for empty graph', () => {
    expect(service.run([], 'A', 'B')).toBeNull();
  });

  it('uses timeCost when preference is fastest', () => {
    const edges: Edge[] = [
      { from: 'A', to: 'B', cost: 10, timeCost: 2 },
      { from: 'A', to: 'C', cost: 5, timeCost: 8 },
      { from: 'B', to: 'D', cost: 8, timeCost: 1 },
      { from: 'C', to: 'D', cost: 2, timeCost: 10 },
    ];
    const result = service.run(edges, 'A', 'D', { preference: 'fastest' });
    expect(result!.totalCost).toBe(3);
    expect(result!.path).toEqual(['A', 'B', 'D']);
  });

  it('uses cost when preference is shortest', () => {
    const edges: Edge[] = [
      { from: 'A', to: 'B', cost: 10, timeCost: 2 },
      { from: 'A', to: 'C', cost: 5, timeCost: 8 },
      { from: 'B', to: 'D', cost: 8, timeCost: 1 },
      { from: 'C', to: 'D', cost: 2, timeCost: 10 },
    ];
    const result = service.run(edges, 'A', 'D', { preference: 'shortest' });
    expect(result!.totalCost).toBe(7);
    expect(result!.path).toEqual(['A', 'C', 'D']);
  });

  it('avoids highway edges when avoidHighways is true', () => {
    const edges: Edge[] = [
      { from: 'A', to: 'B', cost: 1, isHighway: true },
      { from: 'A', to: 'C', cost: 5 },
      { from: 'B', to: 'D', cost: 1, isHighway: true },
      { from: 'C', to: 'D', cost: 5 },
    ];
    const result = service.run(edges, 'A', 'D', { avoidHighways: true });
    expect(result!.totalCost).toBe(10);
    expect(result!.path).toEqual(['A', 'C', 'D']);
  });

  it('returns null when avoidHighways makes destination unreachable', () => {
    const edges: Edge[] = [{ from: 'A', to: 'B', cost: 5, isHighway: true }];
    expect(service.run(edges, 'A', 'B', { avoidHighways: true })).toBeNull();
  });
});
