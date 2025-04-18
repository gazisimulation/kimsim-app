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
          <h2 className="text-xl font-bold text-red-500 mb-2">Something went wrong</h2>
          <p className="text-gray-400">Unable to load simulations. Please try again later.</p>
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
          <>
            <div className="inline-flex items-center mb-4 bg-primary-500/20 px-3 py-1 rounded-full">
              <Clock className="mr-1 h-4 w-4 text-primary-500" />
              <span className="text-sm font-medium text-primary-500">Recently Added</span>
            </div>
            <CategoryRow 
              title="Recently Added" 
              icon={<Clock className="h-5 w-5" />} 
              simulations={recentSimulations} 
            />
          </>
        )}
        
        {analyticalSimulations.length > 0 && (
          <div className="inline-flex items-center mb-4 bg-primary-500/20 px-3 py-1 rounded-full">
            <TestTube className="mr-1 h-4 w-4 text-primary-500" />
            <span className="text-sm font-medium text-primary-500">Analytical Chemistry</span>
          </div>
          <CategoryRow 
            title="Analytical Chemistry" 
            icon={<TestTube className="h-5 w-5" />} 
            simulations={analyticalSimulations} 
          />
        )}
        
        {physicalSimulations.length > 0 && (
          <div className="inline-flex items-center mb-4 bg-primary-500/20 px-3 py-1 rounded-full">
            <Droplets className="mr-1 h-4 w-4 text-primary-500" />
            <span className="text-sm font-medium text-primary-500">Physical Chemistry</span>
          </div>
          <CategoryRow 
            title="Physical Chemistry" 
            icon={<Droplets className="h-5 w-5" />} 
            simulations={physicalSimulations} 
          />
        )}
        
        {organicSimulations.length > 0 && (
          <CategoryRow 
            title="Organic Chemistry" 
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
            <span className="text-sm font-medium text-primary-500">About ChemSim</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">Interactive Chemistry Simulations</h2>
          <p className="text-gray-300 text-lg mb-8 max-w-prose mx-auto">
            ChemSim provides interactive chemistry simulations designed to help students visualize and understand core chemistry concepts. 
            Our simulations offer a hands-on approach to learning, allowing you to experiment with reactions, explore properties, 
            and develop a deeper understanding of chemical principles.
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="p-5 bg-gray-800 rounded-lg">
              <TestTube className="h-8 w-8 text-primary-500 mb-3" />
              <h3 className="text-lg font-bold mb-2">Virtual Labs</h3>
              <p className="text-gray-400">Experience chemistry without the safety concerns of a physical lab.</p>
            </div>
            <div className="p-5 bg-gray-800 rounded-lg">
              <Atom className="h-8 w-8 text-primary-500 mb-3" />
              <h3 className="text-lg font-bold mb-2">Interactive Learning</h3>
              <p className="text-gray-400">Hands-on simulations that help visualize abstract chemistry concepts.</p>
            </div>
            <div className="p-5 bg-gray-800 rounded-lg">
              <Droplets className="h-8 w-8 text-primary-500 mb-3" />
              <h3 className="text-lg font-bold mb-2">Accessible Anywhere</h3>
              <p className="text-gray-400">Access our simulations on any device with a web browser.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Resources Section */}
      <section id="resources" className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-heading font-bold mb-8 text-center">Educational Resources</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">For Students</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center">
                  <div className="bg-primary-500/20 p-2 rounded-full mr-3">
                    <TestTube className="h-4 w-4 text-primary-500" />
                  </div>
                  Study guides for each simulation
                </li>
                <li className="flex items-center">
                  <div className="bg-primary-500/20 p-2 rounded-full mr-3">
                    <TestTube className="h-4 w-4 text-primary-500" />
                  </div>
                  Practice questions and assessments
                </li>
                <li className="flex items-center">
                  <div className="bg-primary-500/20 p-2 rounded-full mr-3">
                    <TestTube className="h-4 w-4 text-primary-500" />
                  </div>
                  Video tutorials for complex topics
                </li>
              </ul>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">For Educators</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center">
                  <div className="bg-primary-500/20 p-2 rounded-full mr-3">
                    <TestTube className="h-4 w-4 text-primary-500" />
                  </div>
                  Lesson plans and teaching guides
                </li>
                <li className="flex items-center">
                  <div className="bg-primary-500/20 p-2 rounded-full mr-3">
                    <TestTube className="h-4 w-4 text-primary-500" />
                  </div>
                  Customizable simulation parameters
                </li>
                <li className="flex items-center">
                  <div className="bg-primary-500/20 p-2 rounded-full mr-3">
                    <TestTube className="h-4 w-4 text-primary-500" />
                  </div>
                  Assessment tools and analytics
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
