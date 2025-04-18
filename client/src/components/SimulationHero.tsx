import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Sparkles, Play, Info } from 'lucide-react';
import type { Simulation } from '@/types';

interface SimulationHeroProps {
  simulation: Simulation;
}

const SimulationHero: React.FC<SimulationHeroProps> = ({ simulation }) => {
  return (
    <section className="relative h-[70vh] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-transparent z-10"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-transparent to-transparent z-10"></div>
      
      <img 
        src={simulation.imageUrl}
        alt={simulation.title} 
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      <div className="relative z-20 container mx-auto px-4 pt-20 h-full flex flex-col justify-center">
        <div className="max-w-2xl backdrop-blur-sm bg-black/40 p-6 rounded-xl shadow-2xl border border-white/10">
          <div className="inline-flex items-center mb-2 bg-primary-500/30 px-3 py-1 rounded-full shadow-lg">
            <Sparkles className="mr-1 h-4 w-4 text-primary-400" />
            <span className="text-sm font-medium text-primary-400">Featured Simulation</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-white drop-shadow-lg">{simulation.title}</h2>
          <p className="text-gray-100 text-lg mb-6 max-w-prose drop-shadow">
            {simulation.description}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button 
              asChild
              size="lg"
              className="bg-primary-500 hover:bg-primary-600 text-white rounded-md font-medium transition flex items-center"
            >
              <Link href={`/simulations/${simulation.slug}`}>
                <a>
                  <Play className="mr-2 h-5 w-5" /> Launch Simulation
                </a>
              </Link>
            </Button>
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default SimulationHero;
