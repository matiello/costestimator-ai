
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { EstimationFormData, SystemType } from "@/types";

interface EstimationFormProps {
  onSubmit: (data: EstimationFormData) => void;
}

const EstimationForm = ({ onSubmit }: EstimationFormProps) => {
  const [formData, setFormData] = useState<EstimationFormData>({
    projectName: "",
    systemType: "BSS",
    description: "",
    requirements: "",
    teamSize: 3,
    startDate: new Date(),
  });
  
  const [processingAI, setProcessingAI] = useState(false);
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, startDate: date }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessingAI(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      onSubmit(formData);
      setProcessingAI(false);
    }, 1500);
  };
  
  return (
    <div id="estimator" className="max-w-3xl mx-auto px-6 py-12 scroll-mt-24">
      <div className="text-center mb-10">
        <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-telecom-100 text-telecom-800 mb-3">
          Gerador de Estimativa
        </span>
        <h2 className="text-3xl font-bold">Defina seu projeto</h2>
        <p className="mt-3 text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
          Forneça os detalhes do seu projeto e nossa IA gerará uma estimativa precisa de pontos de função, custo e prazo.
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Detalhes do Projeto</CardTitle>
            <CardDescription>
              Descreva o escopo e requisitos do seu desenvolvimento
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="projectName">Nome do Projeto</Label>
              <Input
                id="projectName"
                name="projectName"
                className="glass-input"
                placeholder="Ex: Atualização do Sistema de Cobrança"
                value={formData.projectName}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="systemType">Tipo de Sistema</Label>
              <Select
                value={formData.systemType}
                onValueChange={(value) => handleSelectChange("systemType", value)}
              >
                <SelectTrigger className="glass-input">
                  <SelectValue placeholder="Selecione o tipo de sistema" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BSS">BSS (Business Support System)</SelectItem>
                  <SelectItem value="OCS">OCS (Online Charging System)</SelectItem>
                  <SelectItem value="Both">Ambos (BSS e OCS)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição do Projeto</Label>
              <Textarea
                id="description"
                name="description"
                className="glass-input min-h-20"
                placeholder="Descreva o objetivo principal do projeto..."
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="requirements">
                Requisitos (um por linha)
              </Label>
              <Textarea
                id="requirements"
                name="requirements"
                className="glass-input min-h-32"
                placeholder="Ex: Implementar API REST para consulta de faturas&#10;Desenvolver interface para visualização de consumo&#10;Criar sistema de notificação por SMS..."
                value={formData.requirements}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="teamSize">Tamanho da Equipe</Label>
                <Input
                  id="teamSize"
                  name="teamSize"
                  type="number"
                  min="1"
                  max="20"
                  className="glass-input"
                  value={formData.teamSize}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="startDate">Data de Início</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "glass-input w-full justify-start text-left font-normal",
                        !formData.startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.startDate ? (
                        format(formData.startDate, "PPP", { locale: ptBR })
                      ) : (
                        <span>Selecione a data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={handleDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full bg-telecom-600 hover:bg-telecom-700 text-white"
              disabled={processingAI}
            >
              {processingAI ? (
                <>
                  <Cpu className="mr-2 h-4 w-4 animate-pulse" />
                  Processando com IA...
                </>
              ) : (
                "Gerar Estimativa"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default EstimationForm;
