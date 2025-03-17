
import { CheckCircle2, FileCode, GitBranch, Link2, Shield } from "lucide-react";

const ProjectInfo = () => {
  return (
    <div className="py-16 px-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 text-xs font-medium rounded-full bg-telecom-100 text-telecom-800 mb-4">
            Recursos do Sistema
          </span>
          <h2 className="text-3xl font-bold mb-4">Como funciona o CostEstimator</h2>
          <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
            Nossa plataforma utiliza algoritmos avançados e IA para fornecer estimativas precisas para projetos de BSS e OCS.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-6 rounded-xl">
            <div className="h-12 w-12 rounded-lg bg-telecom-100 flex items-center justify-center text-telecom-600 mb-4">
              <FileCode className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Análise de Pontos de Função</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Utilizamos a metodologia APF (Análise de Pontos de Função) para calcular o tamanho funcional do software baseado nos requisitos.
            </p>
            <ul className="mt-4 space-y-2">
              {['Cálculo preciso de PFs', 'Adaptado para BSS/OCS', 'Suporte a Java e PL/SQL'].map((item, i) => (
                <li key={i} className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-telecom-600 mr-2" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="glass-card p-6 rounded-xl">
            <div className="h-12 w-12 rounded-lg bg-telecom-100 flex items-center justify-center text-telecom-600 mb-4">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">IA Especializada</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Nossa IA foi treinada com dados de projetos reais de telecomunicações para fornecer estimativas mais precisas para o seu contexto.
            </p>
            <ul className="mt-4 space-y-2">
              {['Análise de linguagem natural', 'Extração automática de requisitos', 'Aprendizado contínuo'].map((item, i) => (
                <li key={i} className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-telecom-600 mr-2" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="glass-card p-6 rounded-xl">
            <div className="h-12 w-12 rounded-lg bg-telecom-100 flex items-center justify-center text-telecom-600 mb-4">
              <GitBranch className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Planejamento de Equipe</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Com base na complexidade e nos pontos de função, calculamos o tamanho ideal da equipe e o prazo para entrega do projeto.
            </p>
            <ul className="mt-4 space-y-2">
              {['Distribuição de recursos', 'Cronograma detalhado', 'Análise de riscos'].map((item, i) => (
                <li key={i} className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-telecom-600 mr-2" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Nossa solução é ideal para gerentes de projeto, analistas de negócio e líderes técnicos que precisam de estimativas precisas para planejamento e orçamento.
          </p>
          <a 
            href="#estimator" 
            className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-telecom-600 text-white font-medium hover:bg-telecom-700 transition-all shadow-sm"
          >
            <Link2 className="mr-2 h-4 w-4" />
            Comece sua estimativa agora
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProjectInfo;
