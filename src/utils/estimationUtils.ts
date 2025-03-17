
import { ComplexityLevel, ProjectEstimation, RequirementDetail, SystemType } from '@/types';

// Mock AI estimation - In a real application, this would call an AI service
export const generateEstimation = (
  projectName: string,
  systemType: SystemType,
  description: string,
  requirements: string,
  teamSize: number,
  startDate: Date
): ProjectEstimation => {
  // Generate a pseudorandom but deterministic result based on inputs
  const inputHash = (projectName + systemType + description + requirements).length;
  
  // Create requirement details
  const requirementsArray = requirements.split('\n').filter(req => req.trim() !== '');
  const requirementDetails: RequirementDetail[] = requirementsArray.map((req, index) => {
    // Deterministic complexity based on requirement length and position
    const complexityMap: Record<number, ComplexityLevel> = {
      0: 'Simple',
      1: 'Medium',
      2: 'Complex',
      3: 'Very Complex'
    };
    
    const complexityIndex = (req.length + index) % 4;
    const complexity = complexityMap[complexityIndex];
    
    // Deterministic function points based on complexity
    const basePoints = {
      'Simple': 3,
      'Medium': 7,
      'Complex': 12,
      'Very Complex': 20
    };
    
    // Add some variation
    const variation = ((req.length * (index + 1)) % 5) - 2;
    const functionPoints = basePoints[complexity] + variation;
    
    return {
      id: `REQ-${(index + 1).toString().padStart(3, '0')}`,
      description: req,
      complexity,
      functionPoints
    };
  });
  
  // Calculate total function points
  const totalFunctionPoints = requirementDetails.reduce(
    (sum, req) => sum + req.functionPoints, 
    0
  );
  
  // Calculate estimated days based on function points and team size
  // We assume an average of 0.5 days per function point for a single developer
  const baseDaysPerFunctionPoint = 0.5;
  // Team efficiency factor (diminishing returns with larger teams)
  const teamEfficiencyFactor = 1 + Math.log10(teamSize);
  // System type complexity factor
  const systemComplexityFactor = {
    'BSS': 1.0,
    'OCS': 1.2,
    'Both': 1.5
  }[systemType];
  
  const estimatedDays = Math.ceil(
    (totalFunctionPoints * baseDaysPerFunctionPoint * systemComplexityFactor) / 
    teamEfficiencyFactor
  );
  
  // Calculate estimated delivery date
  const deliveryDate = new Date(startDate);
  // Add business days (assume 5 working days per week)
  let daysToAdd = estimatedDays;
  let currentDate = new Date(startDate);
  while (daysToAdd > 0) {
    currentDate.setDate(currentDate.getDate() + 1);
    if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
      daysToAdd--;
    }
  }
  
  // Generate confidence level (65-95%)
  const confidenceBase = 65;
  const confidenceMax = 95;
  const confidenceVariation = inputHash % 31;
  const confidenceLevel = confidenceBase + confidenceVariation;
  
  return {
    projectName,
    systemType,
    description,
    requirements: requirementDetails,
    totalFunctionPoints,
    estimatedDays,
    estimatedTeamSize: teamSize,
    estimatedDeliveryDate: currentDate,
    confidenceLevel
  };
};

// Helper function to format dates consistently
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

// Helper function to map complexity to color
export const getComplexityColor = (complexity: ComplexityLevel): string => {
  const colorMap: Record<ComplexityLevel, string> = {
    'Simple': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'Medium': 'bg-blue-100 text-blue-800 border-blue-200',
    'Complex': 'bg-amber-100 text-amber-800 border-amber-200',
    'Very Complex': 'bg-rose-100 text-rose-800 border-rose-200'
  };
  
  return colorMap[complexity];
};

// Helper function to calculate cost
export const calculateCost = (functionPoints: number): number => {
  // Assume cost per function point (in currency units)
  const costPerFunctionPoint = 500;
  return functionPoints * costPerFunctionPoint;
};

// Helper function to format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
};
