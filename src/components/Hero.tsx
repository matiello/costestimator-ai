
import { ArrowRight, Code, Cpu, Database } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Delay to ensure smooth animation after component mount
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative overflow-hidden pb-16 pt-32 md:pt-40">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('/src/assets/telecom-pattern.svg')] opacity-10" />
      
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="max-w-3xl">
          <span className={cn(
            "inline-block px-4 py-1.5 text-xs font-medium rounded-full bg-telecom-100 text-telecom-800 mb-4 opacity-0 transform translate-y-4",
            isVisible && "opacity-100 transform translate-y-0 transition-all duration-700 ease-out"
          )}>
            Estimativa precisa para telecomunicações
          </span>
          
          <h1 className={cn(
            "text-4xl md:text-5xl lg:text-6xl font-bold leading-tight opacity-0 transform translate-y-4",
            isVisible && "opacity-100 transform translate-y-0 transition-all duration-700 delay-150 ease-out"
          )}>
            Estimativas de custo inteligentes para 
            <span className="text-telecom-600"> BSS e OCS</span>
          </h1>
          
          <p className={cn(
            "mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-2xl opacity-0 transform translate-y-4",
            isVisible && "opacity-100 transform translate-y-0 transition-all duration-700 delay-300 ease-out"
          )}>
            Sistema avançado para geração de estimativas de custo, prazo e complexidade para desenvolvimentos Java e PL/SQL em sistemas de telecomunicações.
          </p>
          
          <div className={cn(
            "mt-8 flex flex-col sm:flex-row gap-4 opacity-0 transform translate-y-4",
            isVisible && "opacity-100 transform translate-y-0 transition-all duration-700 delay-450 ease-out"
          )}>
            <a 
              href="#estimator" 
              className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-telecom-600 text-white font-medium hover:bg-telecom-700 transition-all shadow-sm hover:shadow group"
            >
              Iniciar estimativa
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a 
              href="#" 
              className="inline-flex items-center justify-center px-6 py-3 rounded-md border border-gray-300 hover:border-gray-400 transition-colors font-medium"
            >
              Como funciona
            </a>
          </div>
          
          <div className={cn(
            "mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl opacity-0 transform translate-y-4",
            isVisible && "opacity-100 transform translate-y-0 transition-all duration-700 delay-600 ease-out"
          )}>
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-md bg-telecom-100 text-telecom-600">
                <Code className="h-5 w-5" />
              </div>
              <p className="ml-3 text-sm font-medium">Análise de Pontos de Função</p>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-md bg-telecom-100 text-telecom-600">
                <Cpu className="h-5 w-5" />
              </div>
              <p className="ml-3 text-sm font-medium">IA para análise preliminar</p>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-md bg-telecom-100 text-telecom-600">
                <Database className="h-5 w-5" />
              </div>
              <p className="ml-3 text-sm font-medium">Dados de telecom especializados</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
