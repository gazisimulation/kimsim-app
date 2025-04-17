import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, FlaskRound, Atom, Fuel, Repeat, Rainbow, Grid2x2Check, Flame, ChevronsUp } from 'lucide-react';
import type { Simulation } from '@/types';

interface SimulationCardProps {
  simulation: Simulation;
}

const SimulationCard: React.FC<SimulationCardProps> = ({ simulation }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'analytical':
        return <FlaskRound className="h-3 w-3 mr-1" />;
      case 'physical':
        return <Fuel className="h-3 w-3 mr-1" />;
      case 'organic':
        return <Atom className="h-3 w-3 mr-1" />;
      case 'electrochemistry':
        return <Repeat className="h-3 w-3 mr-1" />;
      case 'instrumental':
        return <Rainbow className="h-3 w-3 mr-1" />;
      case 'thermodynamics':
        return <Flame className="h-3 w-3 mr-1" />;
      case 'kinetics':
        return <ChevronsUp className="h-3 w-3 mr-1" />;
      case 'equilibrium':
        return <Grid2x2Check className="h-3 w-3 mr-1" />;
      default:
        return <FlaskRound className="h-3 w-3 mr-1" />;
    }
  };

  return (
    <div className="flex-shrink-0 w-[280px] group transition-all duration-300">
      <Link href={`/simulations/${simulation.slug}`}>
        <a className="block">
          <Card className="overflow-hidden rounded-lg shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-105 bg-transparent border-0">
            <div className="h-40 bg-gradient-to-br from-blue-500 to-purple-500 relative overflow-hidden">
              <img 
                src={simulation.imageUrl} 
                alt={simulation.title} 
                className="w-full h-full object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-3">
                {simulation.isNew && (
                  <Badge variant="secondary" className="bg-secondary-500 text-white">New</Badge>
                )}
                {simulation.isPopular && (
                  <Badge className="bg-primary-500 text-white">Popular</Badge>
                )}
              </div>
            </div>
            <CardContent className="p-4 bg-gray-800">
              <h3 className="font-medium text-lg text-white mb-1">{simulation.title}</h3>
              <p className="text-gray-300 text-sm mb-2">{simulation.description}</p>
              <div className="flex items-center text-xs text-gray-400">
                <span className="flex items-center">
                  {getCategoryIcon(simulation.category)}
                  {simulation.category.charAt(0).toUpperCase() + simulation.category.slice(1)}
                </span>
                <span className="mx-2">•</span>
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {simulation.duration}
                </span>
              </div>
            </CardContent>
          </Card>
        </a>
      </Link>
    </div>
  );
};

export default SimulationCard;
