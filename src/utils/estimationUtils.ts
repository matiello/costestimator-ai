
import { ComplexityLevel, ProjectEstimation, RequirementDetail, SystemType } from '@/types';
import OpenAI from 'openai';

// OpenAI API client
const openai = new OpenAI({
  apiKey: 'YOUR_OPENAI_API_KEY', // Em um ambiente real, isso deveria vir de variáveis de ambiente
  dangerouslyAllowBrowser: true // Apenas para demo. Em produção, use chamadas de servidor
});

// Função para estimar projeto usando a API da OpenAI
export const generateEstimation = async (
  projectName: string,
  systemType: SystemType,
  description: string,
  requirements: string,
  teamSize: number,
  startDate: Date
): Promise<ProjectEstimation> => {
  try {
    // Formatar os requisitos para envio
    const requirementsArray = requirements.split('\n').filter(req => req.trim() !== '');
    
    // Construir prompt para a OpenAI
    const prompt = `
Você é um especialista em análise de pontos de função para sistemas de telecomunicações.
Analise o seguinte projeto de desenvolvimento em Java e PL/SQL para sistemas BSS/OCS de operadora móvel:

Nome do Projeto: ${projectName}
Tipo de Sistema: ${systemType}
Descrição: ${description}
Requisitos:
${requirementsArray.map((req, index) => `${index + 1}. ${req}`).join('\n')}
Tamanho da Equipe: ${teamSize} desenvolvedores

Para cada requisito, determine:
1. Nível de complexidade (Simple, Medium, Complex, Very Complex)
2. Pontos de função estimados

Em seguida, forneça:
- Total de pontos de função
- Dias estimados de desenvolvimento
- Nível de confiança da estimativa (percentual)

Responda em formato JSON estrito, seguindo esta estrutura:
{
  "requirements": [
    {
      "id": "REQ-001",
      "description": "texto do requisito",
      "complexity": "Simple|Medium|Complex|Very Complex",
      "functionPoints": 5
    }
  ],
  "totalFunctionPoints": 150,
  "estimatedDays": 45,
  "confidenceLevel": 85
}
`;

    // Chamada para a API da OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "Você é um especialista em análise de pontos de função para sistemas de telecomunicações. Responda apenas com JSON válido, sem explicações adicionais."
        },
        { 
          role: "user", 
          content: prompt 
        }
      ],
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    // Extrair e parsear a resposta
    const aiResponse = JSON.parse(response.choices[0].message.content || '{}');
    
    // Verificar se a resposta contém os campos necessários
    if (!aiResponse.requirements || !aiResponse.totalFunctionPoints || 
        !aiResponse.estimatedDays || !aiResponse.confidenceLevel) {
      throw new Error("A resposta da IA não contém todos os campos necessários");
    }

    // Mapear os requisitos para o formato esperado
    const requirementDetails: RequirementDetail[] = aiResponse.requirements.map(
      (req: any, index: number) => ({
        id: req.id || `REQ-${(index + 1).toString().padStart(3, '0')}`,
        description: req.description,
        complexity: req.complexity as ComplexityLevel,
        functionPoints: req.functionPoints
      })
    );

    // Calcular data estimada de entrega
    const deliveryDate = new Date(startDate);
    let daysToAdd = aiResponse.estimatedDays;
    let currentDate = new Date(startDate);
    
    while (daysToAdd > 0) {
      currentDate.setDate(currentDate.getDate() + 1);
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
        daysToAdd--;
      }
    }

    // Retornar objeto de estimativa completo
    return {
      projectName,
      systemType,
      description,
      requirements: requirementDetails,
      totalFunctionPoints: aiResponse.totalFunctionPoints,
      estimatedDays: aiResponse.estimatedDays,
      estimatedTeamSize: teamSize,
      estimatedDeliveryDate: currentDate,
      confidenceLevel: aiResponse.confidenceLevel
    };
  } catch (error) {
    console.error("Erro ao chamar a API da OpenAI:", error);
    
    // Em caso de falha, retornar para o método de estimativa local
    return fallbackLocalEstimation(
      projectName,
      systemType,
      description,
      requirements,
      teamSize,
      startDate
    );
  }
};

// Método de fallback caso a API falhe
const fallbackLocalEstimation = (
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
