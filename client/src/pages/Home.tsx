import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  TestTube, 
  Droplets, 
  Atom, 
  Clock, 
  Sparkles,
  Loader2
} from 'lucide-react';
import SimulationHero from '@/components/SimulationHero';
import CategoryRow from '@/components/CategoryRow';
import type { Simulation } from '@/types';

const Home = () => {
  // Fetch all simulations
  const { 
    data: allSimulations, 
    isLoading, 
    isError 
  } = useQuery<Simulation[]>({
    queryKey: ['/api/simulations'],
  });

  // Organize simulations by category
  const recentSimulations = allSimulations?.filter(sim => sim.isNew) || [];
  const analyticalSimulations = allSimulations?.filter(sim => sim.category === 'analytical') || [];
  const physicalSimulations = allSimulations?.filter(sim => sim.category === 'physical') || [];
  const organicSimulations = allSimulations?.filter(sim => sim.category === 'organic') || [];
  
  // Find the featured simulation
  const featuredSimulation = allSimulations?.find(sim => sim.isFeatured);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-10 w-10 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-screen text-center p-4">
        <div>
          <h2 className="text-xl font-bold text-red-500 mb-2">Bir şeyler yanlış gitti</h2>
          <p className="text-gray-400">Simülasyonlar yüklenemedi. Lütfen daha sonra tekrar deneyin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-primary-900 text-white min-h-screen">
      {/* Hero Section */}
      {featuredSimulation && <SimulationHero simulation={featuredSimulation} />}
      
      {/* Category Sections */}
      <div id="simulations">
        {recentSimulations.length > 0 && (
          <CategoryRow 
            title="Yeni Eklenenler" 
            icon={<Clock className="h-5 w-5" />} 
            simulations={recentSimulations} 
          />
        )}
        
        {analyticalSimulations.length > 0 && (
          <CategoryRow 
            title="Analitik Kimya" 
            icon={<TestTube className="h-5 w-5" />} 
            simulations={analyticalSimulations} 
          />
        )}
        
        {physicalSimulations.length > 0 && (
          <CategoryRow 
            title="Fiziksel Kimya" 
            icon={<Droplets className="h-5 w-5" />} 
            simulations={physicalSimulations} 
          />
        )}
        
        {organicSimulations.length > 0 && (
          <CategoryRow 
            title="Organik Kimya" 
            icon={<Atom className="h-5 w-5" />} 
            simulations={organicSimulations} 
          />
        )}
      </div>
      
      {/* About Section */}
      <section id="about" className="py-16 px-4 bg-gray-900/50">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center mb-4 bg-primary-500/20 px-3 py-1 rounded-full">
            <Sparkles className="mr-1 h-4 w-4 text-primary-500" />
            <span className="text-sm font-medium text-primary-500">ChemSim Hakkında</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">İnteraktif Kimya Simülasyonları</h2>
          <p className="text-gray-300 text-lg mb-8 max-w-prose mx-auto">
            ChemSim, öğrencilerin temel kimya kavramlarını görselleştirmelerini ve anlamalarını sağlamak için tasarlanmış interaktif kimya simülasyonları sunar. 
            Simülasyonlarımız, reaksiyonlarla deney yapmanıza, özellikleri keşfetmenize ve kimyasal prensipleri daha derin bir şekilde anlamanıza olanak tanıyan uygulamalı bir öğrenme yaklaşımı sunar.
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="p-5 bg-gray-800 rounded-lg">
              <TestTube className="h-8 w-8 text-primary-500 mb-3" />
              <h3 className="text-lg font-bold mb-2">Sanal Laboratuvarlar</h3>
              <p className="text-gray-400">Fiziksel bir laboratuvarın güvenlik endişeleri olmadan kimyayı deneyimleyin.</p>
            </div>
            <div className="p-5 bg-gray-800 rounded-lg">
              <Atom className="h-8 w-8 text-primary-500 mb-3" />
              <h3 className="text-lg font-bold mb-2">İnteraktif Öğrenme</h3>
              <p className="text-gray-400">Soyut kimya kavramlarını görselleştirmeye yardımcı olan uygulamalı simülasyonlar.</p>
            </div>
            <div className="p-5 bg-gray-800 rounded-lg">
              <Droplets className="h-8 w-8 text-primary-500 mb-3" />
              <h3 className="text-lg font-bold mb-2">Her Yerden Erişim</h3>
              <p className="text-gray-400">Simülasyonlarımıza web tarayıcısı olan herhangi bir cihazdan erişin.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Resources Section */}
      <section id="resources" className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-heading font-bold mb-8 text-center">Eğitim Kaynakları</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Öğrenciler İçin</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center">
                  <div className="bg-primary-500/20 p-2 rounded-full mr-3">
                    <TestTube className="h-4 w-4 text-primary-500" />
                  </div>
                  Her simülasyon için çalışma kılavuzları
                </li>
                <li className="flex items-center">
                  <div className="bg-primary-500/20 p-2 rounded-full mr-3">
                    <TestTube className="h-4 w-4 text-primary-500" />
                  </div>
                  Alıştırma soruları ve değerlendirmeler
                </li>
                <li className="flex items-center">
                  <div className="bg-primary-500/20 p-2 rounded-full mr-3">
                    <TestTube className="h-4 w-4 text-primary-500" />
                  </div>
                  Karmaşık konular için video eğitimleri
                </li>
              </ul>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Eğitmenler İçin</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center">
                  <div className="bg-primary-500/20 p-2 rounded-full mr-3">
                    <TestTube className="h-4 w-4 text-primary-500" />
                  </div>
                  Ders planları ve öğretim kılavuzları
                </li>
                <li className="flex items-center">
                  <div className="bg-primary-500/20 p-2 rounded-full mr-3">
                    <TestTube className="h-4 w-4 text-primary-500" />
                  </div>
                  Özelleştirilebilir simülasyon parametreleri
                </li>
                <li className="flex items-center">
                  <div className="bg-primary-500/20 p-2 rounded-full mr-3">
                    <TestTube className="h-4 w-4 text-primary-500" />
                  </div>
                  Değerlendirme araçları ve analizler
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
