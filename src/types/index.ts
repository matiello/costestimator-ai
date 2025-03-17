
export type SystemType = 'BSS' | 'OCS' | 'Both';
export type ComplexityLevel = 'Simple' | 'Medium' | 'Complex' | 'Very Complex';

export interface RequirementDetail {
  id: string;
  description: string;
  complexity: ComplexityLevel;
  functionPoints: number;
}

export interface ProjectEstimation {
  projectName: string;
  systemType: SystemType;
  description: string;
  requirements: RequirementDetail[];
  totalFunctionPoints: number;
  estimatedDays: number;
  estimatedTeamSize: number;
  estimatedDeliveryDate: Date;
  confidenceLevel: number;
}

export interface SystemParameter {
  name: string;
  value: number;
  description: string;
}

export interface EstimationFormData {
  projectName: string;
  systemType: SystemType;
  description: string;
  requirements: string;
  teamSize: number;
  startDate: Date;
}
