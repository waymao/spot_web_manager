import type { Ros } from 'roslib';

export type RosType = Ros | null;

export interface Topic {
  name: string;
  type: string;
}

export interface Service {
  name: string;
  type: string;
}

export interface SpotConfig {
  spotName: string;
  spotIntialLoc: [number, number, number];
  spotDockId: number;
}
