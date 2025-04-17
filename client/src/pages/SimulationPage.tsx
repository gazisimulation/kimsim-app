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
import QuantumAtomModelSimulator from '@/components/simulations/QuantumAtomModelSimulator';
import ChemicalBondsSimulator from '@/components/simulations/ChemicalBondsSimulator';
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
      case 'quantum-atom-model':
        return <QuantumAtomModelSimulator />;
      case 'chemical-bonds':
        return <ChemicalBondsSimulator />;
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
                    ) : simulation.slug === 'quantum-atom-model' ? (
                      <>
                        <p>This simulation allows you to visualize different atomic orbitals in a quantum mechanical model of the atom. Follow these steps to interact with the simulation:</p>
                        <ol>
                          <li>Use the <strong>Orbital Type</strong> dropdown to select different orbitals (1s, 2s, 2p, 3s, 3p, 3d).</li>
                          <li><strong>Drag</strong> with your mouse to rotate the 3D visualization and view the orbital from different angles.</li>
                          <li>Use your mouse <strong>scroll wheel</strong> to zoom in and out.</li>
                          <li>Observe the different shapes of each orbital type:</li>
                          <ul>
                            <li><strong>s orbitals</strong> (1s, 2s, 3s): Spherical shape</li>
                            <li><strong>p orbitals</strong> (2p, 3p): Dumbbell shape with two lobes</li>
                            <li><strong>d orbitals</strong> (3d): Complex four-lobed shapes</li>
                          </ul>
                          <li>Read the <strong>Orbital Information</strong> section to learn about each orbital's properties.</li>
                        </ol>
                        <p>You can reset the view at any time using the Reset View button.</p>
                      </>
                    ) : simulation.slug === 'chemical-bonds' ? (
                      <>
                        <p>This simulation allows you to explore three fundamental types of chemical bonds in 3D. Follow these steps to use the simulation:</p>
                        <ol>
                          <li>Select a bond type using the tabs at the top:</li>
                          <ul>
                            <li><strong>Metallic</strong>: Shows a metal lattice with a "sea of electrons"</li>
                            <li><strong>Ionic</strong>: Displays a sodium chloride (NaCl) crystal structure</li>
                            <li><strong>Covalent</strong>: Shows a water molecule (H₂O) with shared electron pairs</li>
                          </ul>
                          <li><strong>Drag</strong> with your mouse to rotate the 3D visualization and examine the structure from different angles.</li>
                          <li>Use your mouse <strong>scroll wheel</strong> to zoom in and out.</li>
                          <li>Observe the behavior and characteristics unique to each bond type:</li>
                          <ul>
                            <li>In the <strong>metallic bond</strong>, watch how the electrons (blue spheres) move freely through the metal lattice.</li>
                            <li>In the <strong>ionic bond</strong>, notice the alternating positive and negative ions and the electrostatic field lines between them.</li>
                            <li>In the <strong>covalent bond</strong>, observe how electrons are shared between atoms and the resulting molecular polarity.</li>
                          </ul>
                        </ol>
                        <p>Take time to read the descriptions for each bond type to understand their properties and significance in chemistry.</p>
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
                    ) : simulation.slug === 'quantum-atom-model' ? (
                      <>
                        <h4>Quantum Mechanical Model of the Atom</h4>
                        <p>The quantum mechanical model of the atom is based on quantum physics principles and represents a major advancement over earlier atomic models like Bohr's model. In this model, electrons don't orbit the nucleus in fixed paths but exist in regions of probability called orbitals.</p>
                        
                        <h4>Atomic Orbitals</h4>
                        <p>An orbital is a three-dimensional region around the nucleus where there is a high probability (typically 90-95%) of finding an electron. Each orbital can hold a maximum of two electrons with opposite spins.</p>
                        <p>Orbitals are described by three quantum numbers:</p>
                        <ul>
                          <li><strong>Principal quantum number (n):</strong> Determines the energy level and size of the orbital (1, 2, 3, etc.)</li>
                          <li><strong>Angular momentum quantum number (l):</strong> Determines the shape of the orbital (0 for s, 1 for p, 2 for d, etc.)</li>
                          <li><strong>Magnetic quantum number (m<sub>l</sub>):</strong> Determines the orientation of the orbital in space</li>
                        </ul>
                        
                        <h4>Types of Orbitals</h4>
                        <ul>
                          <li><strong>s orbitals (l=0):</strong> Spherical shape centered on the nucleus. One orbital per energy level.</li>
                          <li><strong>p orbitals (l=1):</strong> Dumbbell shape with two lobes separated by a nodal plane. Three orbitals per energy level (p<sub>x</sub>, p<sub>y</sub>, p<sub>z</sub>).</li>
                          <li><strong>d orbitals (l=2):</strong> More complex shapes, typically with four lobes. Five orbitals per energy level.</li>
                          <li><strong>f orbitals (l=3):</strong> Even more complex shapes. Seven orbitals per energy level.</li>
                        </ul>
                        
                        <h4>Electron Probability Density</h4>
                        <p>The wave function (Ψ) describes the quantum state of an electron. The square of this function (Ψ²) gives the probability density of finding the electron at a particular point in space. This forms the "electron cloud" or "probability cloud" shown in the simulation.</p>
                      </>
                    ) : simulation.slug === 'chemical-bonds' ? (
                      <>
                        <h4>Chemical Bonding</h4>
                        <p>Chemical bonds are forces that hold atoms together in molecules or compounds. The three primary types of chemical bonds are metallic, ionic, and covalent bonds, each with distinct properties and mechanisms.</p>
                        
                        <h4>Metallic Bonding</h4>
                        <p>Metallic bonding occurs in metals where positive metal ions form a lattice structure while their valence electrons become delocalized, forming a "sea of electrons" that moves freely throughout the structure. This explains key properties of metals:</p>
                        <ul>
                          <li><strong>Electrical conductivity:</strong> Free electrons can carry electric current</li>
                          <li><strong>Thermal conductivity:</strong> Energy can be easily transferred through the electron sea</li>
                          <li><strong>Malleability and ductility:</strong> Metal ions can slide past each other while maintaining the bond</li>
                          <li><strong>Metallic luster:</strong> Free electrons can absorb and emit photons of light</li>
                        </ul>
                        
                        <h4>Ionic Bonding</h4>
                        <p>Ionic bonding forms between metals and non-metals through the complete transfer of electrons. The metal atom loses electrons to become a positively charged ion (cation), while the non-metal atom gains electrons to become a negatively charged ion (anion). Electrostatic attraction between these oppositely charged ions creates the ionic bond.</p>
                        <p>Properties of ionic compounds include:</p>
                        <ul>
                          <li>High melting and boiling points</li>
                          <li>Brittle crystalline structure</li>
                          <li>Electrical conductivity when dissolved in water or melted</li>
                          <li>Solubility in polar solvents</li>
                        </ul>
                        
                        <h4>Covalent Bonding</h4>
                        <p>Covalent bonding occurs when atoms share electron pairs rather than transferring them. This typically happens between non-metal atoms. The shared electrons orbit around both nuclei, creating a strong bond.</p>
                        <p>Covalent bonds can be:</p>
                        <ul>
                          <li><strong>Non-polar:</strong> When electrons are shared equally (e.g., H<sub>2</sub>, O<sub>2</sub>)</li>
                          <li><strong>Polar:</strong> When electrons are unequally shared due to electronegativity differences (e.g., H<sub>2</sub>O)</li>
                        </ul>
                        <p>Properties of covalent compounds include:</p>
                        <ul>
                          <li>Lower melting and boiling points (compared to ionic compounds)</li>
                          <li>Poor electrical conductivity</li>
                          <li>Variable solubility depending on polarity</li>
                        </ul>
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
