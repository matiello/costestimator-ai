
import { useState } from "react";
import Layout from "@/components/Layout";
import Hero from "@/components/Hero";
import EstimationForm from "@/components/EstimationForm";
import ResultsView from "@/components/ResultsView";
import ProjectInfo from "@/components/ProjectInfo";
import { generateEstimation } from "@/utils/estimationUtils";
import { EstimationFormData, ProjectEstimation } from "@/types";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [estimation, setEstimation] = useState<ProjectEstimation | null>(null);
  const { toast } = useToast();

  const handleFormSubmit = (data: EstimationFormData) => {
    try {
      const result = generateEstimation(
        data.projectName,
        data.systemType,
        data.description,
        data.requirements,
        data.teamSize,
        data.startDate
      );
      
      setEstimation(result);
      
      toast({
        title: "Estimativa concluída",
        description: `Análise finalizada para o projeto "${data.projectName}" com ${result.totalFunctionPoints} pontos de função.`,
        variant: "default",
      });
      
      // Scroll to results smoothly
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    } catch (error) {
      console.error("Error generating estimation:", error);
      toast({
        title: "Erro ao gerar estimativa",
        description: "Ocorreu um erro ao processar os dados. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setEstimation(null);
    // Scroll to form section
    setTimeout(() => {
      const estimatorElement = document.getElementById("estimator");
      if (estimatorElement) {
        estimatorElement.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <Layout>
      {estimation ? (
        <ResultsView estimation={estimation} onReset={handleReset} />
      ) : (
        <>
          <Hero />
          <ProjectInfo />
          <EstimationForm onSubmit={handleFormSubmit} />
        </>
      )}
    </Layout>
  );
};

export default Index;
