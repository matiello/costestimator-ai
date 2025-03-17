
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Activity, AreaChart, BarChart3, Menu } from "lucide-react";

const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-6 py-4",
        scrolled ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <AreaChart className="h-6 w-6 text-telecom-600" />
          <span className="text-xl font-medium">CostEstimator</span>
          <span className="text-xs bg-telecom-100 text-telecom-800 px-2 py-0.5 rounded-full ml-2">Beta</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-sm font-medium hover:text-telecom-600 transition-colors">Como funciona</a>
          <a href="#" className="text-sm font-medium hover:text-telecom-600 transition-colors">Recursos</a>
          <a href="#" className="text-sm font-medium hover:text-telecom-600 transition-colors">Documentação</a>
          <a href="#" className="text-sm font-medium hover:text-telecom-600 transition-colors">Suporte</a>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <button className="px-4 py-2 text-sm font-medium text-telecom-600 hover:text-telecom-700 transition-colors">
            Entrar
          </button>
          <button className="px-4 py-2 rounded-md text-sm font-medium bg-telecom-600 text-white hover:bg-telecom-700 transition-colors shadow-sm">
            Iniciar
          </button>
        </div>

        <button 
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile menu */}
      <div 
        className={cn(
          "fixed inset-x-0 top-[73px] px-6 py-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm md:hidden transition-transform duration-300 ease-in-out",
          mobileMenuOpen ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <nav className="flex flex-col space-y-4">
          <a href="#" className="text-sm font-medium hover:text-telecom-600 transition-colors py-2">Como funciona</a>
          <a href="#" className="text-sm font-medium hover:text-telecom-600 transition-colors py-2">Recursos</a>
          <a href="#" className="text-sm font-medium hover:text-telecom-600 transition-colors py-2">Documentação</a>
          <a href="#" className="text-sm font-medium hover:text-telecom-600 transition-colors py-2">Suporte</a>
          <div className="pt-2 flex flex-col space-y-3">
            <button className="px-4 py-2 text-sm font-medium text-telecom-600 hover:text-telecom-700 border border-telecom-200 rounded-md transition-colors">
              Entrar
            </button>
            <button className="px-4 py-2 rounded-md text-sm font-medium bg-telecom-600 text-white hover:bg-telecom-700 transition-colors shadow-sm">
              Iniciar
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Nav;
