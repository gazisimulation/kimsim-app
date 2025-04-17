import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SimulationCard from '@/components/SimulationCard';
import type { Simulation } from '@/types';

interface CategoryRowProps {
  title: string;
  icon: React.ReactNode;
  simulations: Simulation[];
}

const CategoryRow: React.FC<CategoryRowProps> = ({ title, icon, simulations }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollability = () => {
    const el = scrollContainerRef.current;
    if (el) {
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (el) {
      const scrollAmount = 290; // Slightly wider than card width to account for gap
      const currentScroll = el.scrollLeft;
      
      el.scrollTo({
        left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-8 px-4">
      <div className="container mx-auto">
        <h2 className="text-2xl font-heading font-bold mb-4 flex items-center">
          <span className="mr-2 text-primary-500">{icon}</span> {title}
        </h2>
        <div className="relative group">
          {/* Left scroll button */}
          {simulations.length > 4 && (
            <Button
              variant="secondary"
              size="icon"
              className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 border border-gray-700 -ml-4 ${!canScrollLeft ? 'hidden' : ''}`}
              onClick={() => scroll('left')}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          
          {/* Scrollable container */}
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-4 pb-6 -mx-4 px-4 scrollbar-hide"
            onScroll={checkScrollability}
          >
            {simulations.map(simulation => (
              <SimulationCard key={simulation.id} simulation={simulation} />
            ))}
          </div>
          
          {/* Right scroll button */}
          {simulations.length > 4 && (
            <Button
              variant="secondary"
              size="icon"
              className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 border border-gray-700 -mr-4 ${!canScrollRight ? 'hidden' : ''}`}
              onClick={() => scroll('right')}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default CategoryRow;
