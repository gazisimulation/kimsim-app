import { useState } from 'react';
import { useRoute, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Clock, ArrowLeft, FlaskRound, Beaker, BookOpen, HelpCircle, Atom } from 'lucide-react';
import AcidBaseTitrationSimulator from '@/components/simulations/AcidBaseTitrationSimulator';
import type { Simulation } from '@/types';

const SimulationPage = () => {
  const [, params] = useRoute('/simulations/:slug');
  const slug = params?.slug || '';
  const [activeTab, setActiveTab] = useState('simulation');

  const {
    data: simulation,
    isLoading,
    isError,
  } = useQuery<Simulation>({
    queryKey: [`/api/simulations/${slug}`],
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-10 w-10 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (isError || !simulation) {
    return (
      <div className="flex justify-center items-center min-h-screen text-center p-4">
        <div>
          <h2 className="text-xl font-bold text-red-500 mb-2">Simulation Not Found</h2>
          <p className="text-gray-400 mb-4">The simulation you're looking for doesn't exist or has been moved.</p>
          <Button asChild>
            <Link href="/">
              <a>Return to Home</a>
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const renderSimulator = (slug: string) => {
    switch (slug) {
      case 'acid-base-titration':
        return <AcidBaseTitrationSimulator />;
      default:
        return (
          <div className="p-8 text-center">
            <Beaker className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Simulation Under Development</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              This simulation is currently being developed and will be available soon.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="py-12 px-4 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-heading font-bold">{simulation.title}</h2>
          <Button variant="ghost" asChild>
            <Link href="/">
              <a className="text-primary-500 hover:text-primary-400 flex items-center">
                <ArrowLeft className="mr-1 h-4 w-4" /> Back to Simulations
              </a>
            </Link>
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="w-full md:w-8/12">
            <div className="aspect-video relative rounded-lg overflow-hidden mb-4">
              <img
                src={simulation.imageUrl}
                alt={simulation.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            </div>
          </div>
          <div className="w-full md:w-4/12">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-bold mb-4">Simulation Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Category</span>
                    <div className="flex items-center">
                      <FlaskRound className="h-4 w-4 mr-1" />
                      <span>{simulation.category.charAt(0).toUpperCase() + simulation.category.slice(1)}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Duration</span>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{simulation.duration}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Difficulty</span>
                    <Badge>{simulation.difficulty}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {simulation.isNew && <Badge variant="secondary">New</Badge>}
                    {simulation.isPopular && <Badge>Popular</Badge>}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Simulation Container */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          {/* Navigation tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="bg-gray-100 dark:bg-gray-900 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <TabsList className="bg-transparent">
                <TabsTrigger value="simulation" className="data-[state=active]:text-primary-500 data-[state=active]:border-b-2 data-[state=active]:border-primary-500">
                  <Beaker className="h-4 w-4 mr-2" /> Simulation
                </TabsTrigger>
                <TabsTrigger value="instructions" className="data-[state=active]:text-primary-500 data-[state=active]:border-b-2 data-[state=active]:border-primary-500">
                  <HelpCircle className="h-4 w-4 mr-2" /> Instructions
                </TabsTrigger>
                <TabsTrigger value="theory" className="data-[state=active]:text-primary-500 data-[state=active]:border-b-2 data-[state=active]:border-primary-500">
                  <BookOpen className="h-4 w-4 mr-2" /> Theory
                </TabsTrigger>
                <TabsTrigger value="questions" className="data-[state=active]:text-primary-500 data-[state=active]:border-b-2 data-[state=active]:border-primary-500">
                  <Atom className="h-4 w-4 mr-2" /> Questions
                </TabsTrigger>
              </TabsList>
            </div>
            
            {/* Tab content */}
            <div className="p-6">
              <TabsContent value="simulation" className="mt-0">
                {renderSimulator(simulation.slug)}
              </TabsContent>
              
              <TabsContent value="instructions" className="mt-0">
                <div className="max-w-3xl mx-auto py-6">
                  <h3 className="text-2xl font-bold mb-4">How to Use This Simulation</h3>
                  <div className="prose dark:prose-invert">
                    {simulation.slug === 'acid-base-titration' ? (
                      <>
                        <p>This simulation allows you to perform a virtual titration experiment between a strong acid and a strong base. Follow these steps to get started:</p>
                        <ol>
                          <li>Select whether you want to titrate an acid with a base, or a base with an acid using the <strong>Analyte Type</strong> dropdown.</li>
                          <li>Set the <strong>Analyte Volume</strong> in milliliters.</li>
                          <li>Set the <strong>Analyte Concentration</strong> in molarity (M).</li>
                          <li>Set the <strong>Titrant Concentration</strong> in molarity (M).</li>
                          <li>Use the <strong>slider</strong> to add titrant and observe the pH changes.</li>
                          <li>Watch as the titration curve is generated in real-time.</li>
                          <li>Note the <strong>Equivalence Point</strong> that shows where the amount of titrant added is stoichiometrically equal to the amount of analyte.</li>
                          <li>Observe the <strong>color change</strong> in the flask when the phenolphthalein indicator changes color (around pH 8.2).</li>
                        </ol>
                        <p>You can reset the simulation at any time using the Reset button.</p>
                      </>
                    ) : (
                      <p>Instructions for this simulation will be available soon.</p>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="theory" className="mt-0">
                <div className="max-w-3xl mx-auto py-6">
                  <h3 className="text-2xl font-bold mb-4">Theoretical Background</h3>
                  <div className="prose dark:prose-invert">
                    {simulation.slug === 'acid-base-titration' ? (
                      <>
                        <h4>Acid-Base Titration</h4>
                        <p>An acid-base titration is a method in analytical chemistry used to determine the concentration of an acid or base by exactly neutralizing it with a standard solution of base or acid of known concentration.</p>
                        
                        <h4>The Titration Curve</h4>
                        <p>The titration curve represents the pH as a function of the amount of titrant added. For a strong acid-strong base titration, the curve has several key regions:</p>
                        <ul>
                          <li><strong>Before the equivalence point:</strong> The pH is dominated by the excess analyte.</li>
                          <li><strong>At the equivalence point:</strong> The pH is 7.0 for a strong acid-strong base titration.</li>
                          <li><strong>After the equivalence point:</strong> The pH is dominated by the excess titrant.</li>
                        </ul>
                        
                        <h4>pH Calculations</h4>
                        <p>The pH at any point during the titration is calculated based on the concentration of H+ ions:</p>
                        <ul>
                          <li>For acids: pH = -log[H+]</li>
                          <li>For bases: pH = 14 - (-log[OH-]) = 14 - pOH</li>
                        </ul>
                        
                        <h4>Indicators</h4>
                        <p>Indicators are substances that change color at specific pH values. Phenolphthalein is commonly used in acid-base titrations, changing from colorless (pH &lt; 8.2) to pink (pH &gt; 8.2).</p>
                      </>
                    ) : (
                      <p>Theoretical background for this simulation will be available soon.</p>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="questions" className="mt-0">
                <div className="max-w-3xl mx-auto py-6">
                  <h3 className="text-2xl font-bold mb-4">Practice Questions</h3>
                  <div className="prose dark:prose-invert">
                    {simulation.slug === 'acid-base-titration' ? (
                      <>
                        <ol>
                          <li>If you have 50 mL of 0.1 M HCl, how many mL of 0.1 M NaOH would you need to reach the equivalence point?</li>
                          <li>What is the pH at the equivalence point of a strong acid-strong base titration?</li>
                          <li>How does the pH change when you're titrating a weak acid with a strong base compared to a strong acid with a strong base?</li>
                          <li>Why does the pH change slowly at first and then rapidly near the equivalence point?</li>
                          <li>If you double the concentration of both the analyte and titrant, how would this affect the volume needed to reach the equivalence point?</li>
                          <li>What is the purpose of using an indicator in a titration?</li>
                          <li>How would you select an appropriate indicator for an acid-base titration?</li>
                          <li>Calculate the pH when 24.5 mL of 0.1 M NaOH has been added to 50 mL of 0.1 M HCl.</li>
                        </ol>
                      </>
                    ) : (
                      <p>Practice questions for this simulation will be available soon.</p>
                    )}
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SimulationPage;
