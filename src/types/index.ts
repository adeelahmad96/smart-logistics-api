export interface Edge {
  from: string;
  to: string;
  cost: number;
  timeCost?: number;
  isHighway?: boolean;
}

export interface Node {
  id: string;
}

export interface Network {
  id: string;
  nodes: Node[];
  edges: Edge[];
  createdAt: Date;
}
