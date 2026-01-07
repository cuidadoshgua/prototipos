
export enum ProcessStatus {
  DRAFT = 'Borrador',
  REVIEW = 'En Revisión',
  VALIDATED = 'Validado',
  IMPLEMENTED = 'Implementado'
}

export interface KPI {
  id: string;
  name: string;
  description: string;
  formula: string;
  source: string;
  frequency: string;
}

export interface SystemDependency {
  id: string;
  name: string;
  functionality: string;
  actors: string;
  integrationLevel: 'Alto' | 'Medio' | 'Bajo' | 'Nulo';
}

export interface ImprovementOpportunity {
  id: string;
  description: string;
  priority: 'Alta' | 'Media' | 'Baja';
  impact: 'Alto' | 'Medio' | 'Bajo';
  responsible: string;
}

export interface Actor {
  id: string;
  role: string;
  responsibilities: string;
  color?: string; 
  isCollapsed?: boolean;
}

export interface MainActivity {
  id: string;
  description: string;
  performer: string;
}

export interface ReferenceLink {
  id: string;
  description: string;
  url: string;
}

export interface ToBeDefinition {
  vision: string;
  expectedBenefits: string;
  gapAnalysis: string;
  transitionPlan: string;
}

export type BpmnNodeType = 'start' | 'task' | 'gateway' | 'end';

export interface BpmnNode {
  id: string;
  type: BpmnNodeType;
  x: number;
  y: number;
  label: string;
  laneId?: string;
}

export interface BpmnEdge {
  id: string;
  sourceId: string;
  targetId: string;
}

export interface BpmnDiagram {
  nodes: BpmnNode[];
  edges: BpmnEdge[];
}

export interface ProcessModel {
  id: string;
  processId: string;
  name: string;
  area: string;
  responsiblePerson: string;
  status: ProcessStatus;
  createdAt: string;
  lastModified: string;
  objective: string;
  description: string;
  triggerEvent: string;
  endEvent: string;
  mainActivities: MainActivity[];
  digitalizationPriorities: string;
  references: ReferenceLink[];
  actors: Actor[];
  systems: SystemDependency[];
  kpis: KPI[];
  diagram: BpmnDiagram;
  improvements: ImprovementOpportunity[];
  toBe: ToBeDefinition;
  policies: string;
  contingencyPlan: string;
}

export const EMPTY_PROCESS: ProcessModel = {
  id: '',
  processId: '',
  name: '',
  area: '',
  responsiblePerson: '',
  status: ProcessStatus.DRAFT,
  createdAt: new Date().toISOString(),
  lastModified: new Date().toISOString(),
  objective: '',
  description: '',
  triggerEvent: '',
  endEvent: '',
  mainActivities: [],
  digitalizationPriorities: '',
  references: [],
  actors: [],
  systems: [],
  kpis: [],
  diagram: { nodes: [], edges: [] },
  improvements: [],
  toBe: {
    vision: '',
    expectedBenefits: '',
    gapAnalysis: '',
    transitionPlan: ''
  },
  policies: '',
  contingencyPlan: ''
};
