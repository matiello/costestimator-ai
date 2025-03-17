
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ProjectEstimation, RequirementDetail } from "@/types";
import { formatDate, getComplexityColor, calculateCost, formatCurrency } from "@/utils/estimationUtils";
import { CalendarDays, Download, BarChart, CheckCircle, Clock, Users, Calculator, FileText } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ResultsViewProps {
  estimation: ProjectEstimation;
  onReset: () => void;
}

const ResultsView = ({ estimation, onReset }: ResultsViewProps) => {
  const [activeTab, setActiveTab] = useState("summary");
  
  const totalCost = calculateCost(estimation.totalFunctionPoints);
  
  const handleDownloadReport = () => {
    // In a real application, this would generate a PDF or Excel report
    alert("Em uma aplicação real, isso geraria um relatório completo para download.");
  };
  
  // Helper function to group requirements by complexity
  const groupByComplexity = (requirements: RequirementDetail[]) => {
    const result: Record<string, RequirementDetail[]> = {
      'Simple': [],
      'Medium': [],
      'Complex': [],
      'Very Complex': []
    };
    
    requirements.forEach(req => {
      result[req.complexity].push(req);
    });
    
    return result;
  };
  
  const complexityGroups = groupByComplexity(estimation.requirements);
  
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 scroll-mt-24">
      <div className="text-center mb-10 animate-fade-in">
        <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 mb-3">
          Análise Concluída
        </span>
        <h2 className="text-3xl font-bold">Estimativa do Projeto</h2>
        <p className="mt-3 text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
          Nossa IA analisou os requisitos e gerou uma estimativa detalhada para o seu projeto.
        </p>
      </div>
      
      <div className="mb-8 animate-slide-up animate-delay-100">
        <Card className="glass-card overflow-hidden">
          <CardHeader className="bg-telecom-50/50 dark:bg-telecom-900/20 border-b border-telecom-100/50 dark:border-telecom-800/30">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{estimation.projectName}</CardTitle>
                <CardDescription className="mt-1">
                  Sistema: {estimation.systemType === 'BSS' ? 'Business Support System' : 
                            estimation.systemType === 'OCS' ? 'Online Charging System' : 
                            'BSS & OCS'}
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Nível de confiança</div>
                <div className="flex items-center mt-1">
                  <Progress value={estimation.confidenceLevel} className="h-2 w-24" />
                  <span className="ml-2 text-sm font-medium">{estimation.confidenceLevel}%</span>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-telecom-100 flex items-center justify-center text-telecom-600">
                  <Calculator className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Pontos de Função</div>
                  <div className="text-xl font-bold">{estimation.totalFunctionPoints} PF</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Prazo Estimado</div>
                  <div className="text-xl font-bold">{estimation.estimatedDays} dias</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Custo Estimado</div>
                  <div className="text-xl font-bold">{formatCurrency(totalCost)}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Data de Entrega</div>
                  <div className="text-xl font-bold">{formatDate(estimation.estimatedDeliveryDate)}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="summary" className="animate-slide-up animate-delay-200" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="summary">Resumo</TabsTrigger>
          <TabsTrigger value="requirements">Requisitos</TabsTrigger>
          <TabsTrigger value="details">Detalhes Técnicos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart className="mr-2 h-5 w-5 text-telecom-600" />
                Distribuição de Complexidade
              </CardTitle>
              <CardDescription>
                Análise de requisitos por nível de complexidade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(['Simple', 'Medium', 'Complex', 'Very Complex'] as const).map((complexity) => {
                  const items = complexityGroups[complexity];
                  const totalPoints = items.reduce((sum, item) => sum + item.functionPoints, 0);
                  const percentage = estimation.totalFunctionPoints > 0 
                    ? Math.round((totalPoints / estimation.totalFunctionPoints) * 100) 
                    : 0;
                  
                  const complexityLabels = {
                    'Simple': 'Simples',
                    'Medium': 'Médio',
                    'Complex': 'Complexo',
                    'Very Complex': 'Muito Complexo'
                  };
                  
                  return (
                    <div key={complexity} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className={cn(
                            "w-3 h-3 rounded-full mr-2",
                            {
                              'bg-emerald-500': complexity === 'Simple',
                              'bg-blue-500': complexity === 'Medium',
                              'bg-amber-500': complexity === 'Complex',
                              'bg-rose-500': complexity === 'Very Complex',
                            }
                          )} />
                          <span>{complexityLabels[complexity]}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">{items.length} requisitos</span>
                          <span className="text-muted-foreground ml-2">({totalPoints} PF)</span>
                        </div>
                      </div>
                      <Progress 
                        value={percentage} 
                        className={cn(
                          "h-2",
                          {
                            'bg-emerald-100': complexity === 'Simple',
                            'bg-blue-100': complexity === 'Medium',
                            'bg-amber-100': complexity === 'Complex',
                            'bg-rose-100': complexity === 'Very Complex',
                          }
                        )}
                        indicatorClassName={cn({
                          'bg-emerald-500': complexity === 'Simple',
                          'bg-blue-500': complexity === 'Medium',
                          'bg-amber-500': complexity === 'Complex',
                          'bg-rose-500': complexity === 'Very Complex',
                        })}
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-telecom-600" />
                  Equipe Recomendada
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Desenvolvedores Java</span>
                    <span className="font-medium">{Math.ceil(estimation.estimatedTeamSize * 0.6)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Desenvolvedores PL/SQL</span>
                    <span className="font-medium">{Math.ceil(estimation.estimatedTeamSize * 0.4)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>QA / Testadores</span>
                    <span className="font-medium">{Math.ceil(estimation.estimatedTeamSize * 0.3)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="font-medium">Total</span>
                    <span className="font-medium">{estimation.estimatedTeamSize + Math.ceil(estimation.estimatedTeamSize * 0.3)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-telecom-600" />
                  Cronograma Estimado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Análise e Planejamento</span>
                    <span className="font-medium">{Math.ceil(estimation.estimatedDays * 0.2)} dias</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Desenvolvimento</span>
                    <span className="font-medium">{Math.ceil(estimation.estimatedDays * 0.5)} dias</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Testes e QA</span>
                    <span className="font-medium">{Math.ceil(estimation.estimatedDays * 0.2)} dias</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Implantação</span>
                    <span className="font-medium">{Math.ceil(estimation.estimatedDays * 0.1)} dias</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="font-medium">Total</span>
                    <span className="font-medium">{estimation.estimatedDays} dias</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="requirements" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Análise de Requisitos</CardTitle>
              <CardDescription>
                Detalhamento dos requisitos e pontos de função
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {(['Simple', 'Medium', 'Complex', 'Very Complex'] as const).map((complexity) => {
                  const items = complexityGroups[complexity];
                  if (items.length === 0) return null;
                  
                  const complexityLabels = {
                    'Simple': 'Simples',
                    'Medium': 'Médio',
                    'Complex': 'Complexo',
                    'Very Complex': 'Muito Complexo'
                  };
                  
                  return (
                    <div key={complexity} className="space-y-3">
                      <h3 className="text-lg font-medium">
                        {complexityLabels[complexity]} ({items.length})
                      </h3>
                      <div className="space-y-2">
                        {items.map((req) => (
                          <div 
                            key={req.id} 
                            className="p-3 rounded-md border flex justify-between items-center"
                          >
                            <div className="flex items-start gap-3">
                              <div className={cn(
                                "px-2 py-1 text-xs font-medium rounded",
                                getComplexityColor(req.complexity)
                              )}>
                                {req.id}
                              </div>
                              <span>{req.description}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-sm font-medium">
                              <span>{req.functionPoints}</span>
                              <span className="text-muted-foreground">PF</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="details" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Detalhes Técnicos</CardTitle>
              <CardDescription>
                Informações detalhadas sobre a metodologia de estimativa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Metodologia</h3>
                  <p className="text-muted-foreground">
                    A estimativa foi realizada utilizando a técnica de Análise de Pontos de Função (APF) adaptada para sistemas BSS e OCS de telecomunicações. O cálculo considera fatores técnicos específicos para desenvolvimento Java e PL/SQL.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Fatores Considerados</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Complexidade técnica</span>
                        <span className="font-medium">1.{Math.round(estimation.confidenceLevel / 10)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Integração com sistemas legados</span>
                        <span className="font-medium">1.{Math.round((estimation.totalFunctionPoints % 10) + 2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Experiência da equipe</span>
                        <span className="font-medium">0.{Math.round(90 - (estimation.confidenceLevel % 10))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Disponibilidade de recursos</span>
                        <span className="font-medium">1.0</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Métricas de Custo</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Custo por Ponto de Função</span>
                        <span className="font-medium">R$ 500,00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Custo Diário Equipe</span>
                        <span className="font-medium">
                          {formatCurrency(totalCost / estimation.estimatedDays)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Custo Total Estimado</span>
                        <span className="font-medium">{formatCurrency(totalCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Margem de Erro</span>
                        <span className="font-medium">±{Math.round(100 - estimation.confidenceLevel)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Distribuição de Esforço</h3>
                  <div className="h-4 w-full flex rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full" style={{ width: '20%' }}></div>
                    <div className="bg-blue-500 h-full" style={{ width: '50%' }}></div>
                    <div className="bg-amber-500 h-full" style={{ width: '20%' }}></div>
                    <div className="bg-rose-500 h-full" style={{ width: '10%' }}></div>
                  </div>
                  <div className="flex text-xs mt-2 text-center">
                    <div className="w-1/5">
                      <div className="text-emerald-600 font-medium">Análise</div>
                      <div>20%</div>
                    </div>
                    <div className="w-1/2">
                      <div className="text-blue-600 font-medium">Desenvolvimento</div>
                      <div>50%</div>
                    </div>
                    <div className="w-1/5">
                      <div className="text-amber-600 font-medium">Testes</div>
                      <div>20%</div>
                    </div>
                    <div className="w-1/10">
                      <div className="text-rose-600 font-medium">Implantação</div>
                      <div>10%</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-between mt-8 animate-slide-up animate-delay-300">
        <Button 
          variant="outline" 
          onClick={onReset}
        >
          Nova Estimativa
        </Button>
        
        <Button 
          className="bg-telecom-600 hover:bg-telecom-700 text-white"
          onClick={handleDownloadReport}
        >
          <Download className="mr-2 h-4 w-4" />
          Baixar Relatório
        </Button>
      </div>
    </div>
  );
};

export default ResultsView;
