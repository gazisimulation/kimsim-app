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
import StateChangeSimulator from '@/components/simulations/StateChangeSimulator';
import GasLawsSimulator from '@/components/simulations/GasLawsSimulator';
import BatterySimulator from '@/components/simulations/BatterySimulator';
import ChemistryCalculatorsSimulator from '@/components/simulations/ChemistryCalculatorsSimulator';
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
      case 'state-change':
        return <StateChangeSimulator />;
      case 'gas-laws':
        return <GasLawsSimulator />;
      case 'battery-simulator':
        return <BatterySimulator />;
      case 'chemistry-calculators':
        return <ChemistryCalculatorsSimulator />;
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
                <ArrowLeft className="mr-1 h-4 w-4" /> Simülasyonlara Dön
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
                <h3 className="text-lg font-bold mb-4">Simülasyon Detayları</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Kategori</span>
                    <div className="flex items-center">
                      <FlaskRound className="h-4 w-4 mr-1" />
                      <span>{simulation.category.charAt(0).toUpperCase() + simulation.category.slice(1)}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Süre</span>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{simulation.duration}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Zorluk</span>
                    <Badge>{simulation.difficulty}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {simulation.isNew && <Badge variant="secondary">Yeni</Badge>}
                    {simulation.isPopular && <Badge>Popüler</Badge>}
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
                  <Beaker className="h-4 w-4 mr-2" /> Simülasyon
                </TabsTrigger>
                <TabsTrigger value="instructions" className="data-[state=active]:text-primary-500 data-[state=active]:border-b-2 data-[state=active]:border-primary-500">
                  <HelpCircle className="h-4 w-4 mr-2" /> Talimatlar
                </TabsTrigger>
                <TabsTrigger value="theory" className="data-[state=active]:text-primary-500 data-[state=active]:border-b-2 data-[state=active]:border-primary-500">
                  <BookOpen className="h-4 w-4 mr-2" /> Teori
                </TabsTrigger>
                <TabsTrigger value="questions" className="data-[state=active]:text-primary-500 data-[state=active]:border-b-2 data-[state=active]:border-primary-500">
                  <Atom className="h-4 w-4 mr-2" /> Sorular
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
                    ) : simulation.slug === 'state-change' ? (
                      <>
                        <p>This simulation allows you to explore phase transitions of different substances with customizable parameters. Follow these steps to use the simulation:</p>
                        <ol>
                          <li>Select a <strong>substance</strong> from the dropdown menu (Water, Iron, or Nitrogen).</li>
                          <li>Adjust the <strong>mass</strong> of the substance (in grams) to see how it affects the energy required for phase changes.</li>
                          <li>Modify the <strong>heating/cooling rate</strong> to control how quickly energy is added or removed from the system.</li>
                          <li>Use the <strong>simulation speed</strong> slider to adjust how fast the simulation runs.</li>
                          <li>Click the <strong>Heat</strong> button to add thermal energy to the substance and observe phase transitions as temperature increases.</li>
                          <li>Click the <strong>Cool</strong> button to remove thermal energy and watch the substance transition to lower energy states.</li>
                          <li>Use the <strong>Stop</strong> button to pause the heating or cooling process.</li>
                          <li>Observe how the substance changes between solid, liquid, and gas phases:</li>
                          <ul>
                            <li>During <strong>melting</strong> and <strong>boiling</strong>, notice how the temperature remains constant while energy is still being added (latent heat).</li>
                            <li>Note the different heat capacities for each phase of the substance.</li>
                            <li>Compare the different melting and boiling points of the three substances.</li>
                          </ul>
                        </ol>
                        <p>The right side of the simulation shows detailed data about the current state, temperature, and energy of the substance, as well as substance-specific properties like heat capacity and latent heat values.</p>
                      </>
                    ) : simulation.slug === 'gas-laws' ? (
                      <>
                        <p>This simulation allows you to explore gas behavior and the relationships between pressure, volume, temperature, and moles of gas. Follow these steps to use the simulation:</p>
                        <ol>
                          <li>Navigate between four tabs to explore different aspects of gas behavior:
                            <ul>
                              <li><strong>Ideal Gas Law</strong>: Explore relationships between gas parameters (P, V, T, n)</li>
                              <li><strong>Kinetic Theory</strong>: Visualize molecular motion and speed distribution</li>
                              <li><strong>Gas Mixtures</strong>: Explore Dalton's Law of Partial Pressures</li>
                              <li><strong>Real Gases</strong>: Compare ideal and non-ideal (Van der Waals) gas behaviors</li>
                            </ul>
                          </li>
                          <li>For each tab:
                            <ul>
                              <li>Select different <strong>gas types</strong> from the dropdown menu to compare properties</li>
                              <li>Adjust parameters using the <strong>sliders</strong>:
                                <ul>
                                  <li>Moles of gas (n)</li>
                                  <li>Temperature (T) in Kelvin</li>
                                  <li>Pressure (P) in atmospheres</li>
                                  <li>Volume (V) in liters (in some tabs)</li>
                                </ul>
                              </li>
                            </ul>
                          </li>
                          <li>In the <strong>Ideal Gas Law</strong> tab:
                            <ul>
                              <li>Select the gas law model (Ideal or Van der Waals)</li>
                              <li>Choose different chart types (pressure-volume, pressure-temperature, etc.)</li>
                              <li>Observe how changing parameters affects the graphs</li>
                            </ul>
                          </li>
                          <li>In the <strong>Kinetic Theory</strong> tab:
                            <ul>
                              <li>Watch the particle simulation to see how molecular motion changes with temperature</li>
                              <li>Toggle the speed distribution histogram to visualize the Maxwell-Boltzmann distribution</li>
                            </ul>
                          </li>
                          <li>In the <strong>Gas Mixtures</strong> tab:
                            <ul>
                              <li>Select two different gases and adjust their proportions</li>
                              <li>Observe how the partial pressures change based on Dalton's Law</li>
                            </ul>
                          </li>
                          <li>In the <strong>Real Gases</strong> tab:
                            <ul>
                              <li>Compare ideal and real gas behaviors at various pressures and temperatures</li>
                              <li>See the deviation percentage between the models</li>
                              <li>Learn about the Van der Waals parameters for different gases</li>
                            </ul>
                          </li>
                        </ol>
                        <p>All charts and visualizations update in real-time as you adjust the parameters, allowing you to observe the relationships between gas variables dynamically.</p>
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
                    ) : simulation.slug === 'state-change' ? (
                      <>
                        <h4>States of Matter</h4>
                        <p>Matter can exist in various states, primarily solid, liquid, and gas. Each state has distinct properties based on the arrangement and movement of particles:</p>
                        <ul>
                          <li><strong>Solid:</strong> Particles are tightly packed in a regular pattern with strong intermolecular forces, giving solids a fixed shape and volume.</li>
                          <li><strong>Liquid:</strong> Particles are close together but can move past each other, allowing liquids to flow and take the shape of their container while maintaining a fixed volume.</li>
                          <li><strong>Gas:</strong> Particles are widely separated with minimal intermolecular forces, allowing gases to expand to fill their container.</li>
                        </ul>
                        
                        <h4>Phase Transitions</h4>
                        <p>When substances change from one state to another, they undergo phase transitions. The major phase transitions are:</p>
                        <ul>
                          <li><strong>Melting (fusion):</strong> Solid → Liquid</li>
                          <li><strong>Freezing:</strong> Liquid → Solid</li>
                          <li><strong>Vaporization (boiling):</strong> Liquid → Gas</li>
                          <li><strong>Condensation:</strong> Gas → Liquid</li>
                          <li><strong>Sublimation:</strong> Solid → Gas</li>
                          <li><strong>Deposition:</strong> Gas → Solid</li>
                        </ul>
                        
                        <h4>Heat and Temperature</h4>
                        <p>Temperature is a measure of the average kinetic energy of particles in a substance. Heat is the total energy that flows between substances due to temperature differences.</p>
                        <p>When heat is added to or removed from a substance, one of two things happens:</p>
                        <ol>
                          <li>The temperature changes if the substance remains in the same phase</li>
                          <li>A phase change occurs at constant temperature if the substance is at its melting or boiling point</li>
                        </ol>
                        
                        <h4>Heat Capacity</h4>
                        <p>Heat capacity (c) is the amount of heat needed to raise the temperature of a substance by one degree. It varies between phases of the same substance:</p>
                        <p>The energy required to change the temperature is calculated using: Q = mc∆T where:</p>
                        <ul>
                          <li>Q = energy (heat) in joules</li>
                          <li>m = mass in grams</li>
                          <li>c = specific heat capacity in J/g·°C</li>
                          <li>∆T = temperature change in °C</li>
                        </ul>
                        
                        <h4>Latent Heat</h4>
                        <p>Latent heat is the energy required to change the phase of a substance without changing its temperature:</p>
                        <ul>
                          <li><strong>Latent heat of fusion:</strong> Energy required to convert a solid to a liquid at its melting point</li>
                          <li><strong>Latent heat of vaporization:</strong> Energy required to convert a liquid to a gas at its boiling point</li>
                        </ul>
                        <p>The energy required for a phase change is calculated using: Q = mL where:</p>
                        <ul>
                          <li>Q = energy (heat) in joules</li>
                          <li>m = mass in grams</li>
                          <li>L = latent heat in J/g</li>
                        </ul>
                      </>
                    ) : simulation.slug === 'gas-laws' ? (
                      <>
                        <h4>Properties of Gases</h4>
                        <p>Gases have several unique properties that distinguish them from solids and liquids:</p>
                        <ul>
                          <li>They have no definite shape or volume and expand to fill their container</li>
                          <li>They are easily compressible compared to liquids and solids</li>
                          <li>They have lower density than liquids and solids</li>
                          <li>Gas particles move randomly with high kinetic energy</li>
                          <li>Gas particles have negligible interactions except during collisions</li>
                        </ul>
                        
                        <h4>Ideal Gas Law</h4>
                        <p>The Ideal Gas Law is a fundamental equation that relates the four macroscopic properties of gases:</p>
                        <p className="text-center font-medium my-2">PV = nRT</p>
                        <p>Where:</p>
                        <ul>
                          <li><strong>P</strong> = pressure (atm, Pa, or other pressure units)</li>
                          <li><strong>V</strong> = volume (L, m³, or other volume units)</li>
                          <li><strong>n</strong> = number of moles of gas</li>
                          <li><strong>R</strong> = gas constant (0.08206 L·atm/mol·K)</li>
                          <li><strong>T</strong> = absolute temperature (K)</li>
                        </ul>
                        <p>This equation is derived from the combination of Boyle's Law (P ∝ 1/V), Charles's Law (V ∝ T), and Avogadro's Law (V ∝ n).</p>
                        
                        <h4>Kinetic Theory of Gases</h4>
                        <p>The Kinetic Molecular Theory explains the behavior of gases at the molecular level:</p>
                        <ul>
                          <li>Gas particles are in constant, random motion</li>
                          <li>Collisions between gas particles and with container walls are perfectly elastic</li>
                          <li>The average kinetic energy of gas particles is proportional to absolute temperature</li>
                          <li>Gas particles have negligible volume compared to the container</li>
                          <li>There are no attractive or repulsive forces between particles</li>
                        </ul>
                        
                        <h4>Maxwell-Boltzmann Distribution</h4>
                        <p>This distribution describes the range of molecular speeds in a gas at a given temperature:</p>
                        <ul>
                          <li><strong>Most probable speed (v<sub>mp</sub>):</strong> The speed at which most molecules are moving</li>
                          <li><strong>Average speed (v<sub>avg</sub>):</strong> The arithmetic mean of all molecular speeds</li>
                          <li><strong>Root mean square speed (v<sub>rms</sub>):</strong> √(3RT/M) where M is molar mass in kg/mol</li>
                        </ul>
                        <p>At higher temperatures, the distribution shifts toward higher speeds, and lighter gases have higher average speeds at the same temperature.</p>
                        
                        <h4>Gas Mixtures and Dalton's Law</h4>
                        <p>Dalton's Law of Partial Pressures states that in a mixture of non-reacting gases, the total pressure is the sum of the partial pressures of each individual gas:</p>
                        <p className="text-center font-medium my-2">P<sub>total</sub> = P<sub>1</sub> + P<sub>2</sub> + ... + P<sub>n</sub></p>
                        <p>The partial pressure of each gas is proportional to its mole fraction in the mixture:</p>
                        <p className="text-center font-medium my-2">P<sub>i</sub> = x<sub>i</sub> × P<sub>total</sub></p>
                        <p>where x<sub>i</sub> is the mole fraction (n<sub>i</sub>/n<sub>total</sub>).</p>
                        
                        <h4>Real Gases and Van der Waals Equation</h4>
                        <p>Real gases deviate from ideal behavior, especially at high pressures and low temperatures. The Van der Waals equation accounts for:</p>
                        <ul>
                          <li>The actual volume of gas molecules (b term)</li>
                          <li>Attractive forces between molecules (a term)</li>
                        </ul>
                        <p className="text-center font-medium my-2">(P + a(n/V)²)(V - nb) = nRT</p>
                        <p>Where a and b are gas-specific constants:</p>
                        <ul>
                          <li>a accounts for attractive forces between molecules</li>
                          <li>b accounts for the finite volume of gas molecules</li>
                        </ul>
                        <p>At low pressures and high temperatures, the Van der Waals equation approaches the ideal gas law.</p>
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
                    ) : simulation.slug === 'state-change' ? (
                      <>
                        <ol>
                          <li>How much energy is required to convert 100g of ice at -10°C to water at 20°C? (Use water's heat capacity for solid = 2.108 J/g°C, latent heat of fusion = 333.55 J/g, heat capacity for liquid = 4.18 J/g°C)</li>
                          <li>Explain why the temperature remains constant during the melting and boiling processes, even though heat is continuously being added to the system.</li>
                          <li>Why does water have a higher specific heat capacity in its liquid state compared to its solid state?</li>
                          <li>Compare the melting and boiling points of water, iron, and nitrogen. Explain the differences in terms of intermolecular forces.</li>
                          <li>Calculate the total energy needed to convert 50g of water at 25°C to steam at 110°C.</li>
                          <li>If 500 J of heat is added to 20g of ice at 0°C, how much ice will melt? Will all of it melt?</li>
                          <li>Why does the density of most substances decrease as they transition from solid to liquid to gas? Why is water unusual in this regard?</li>
                          <li>How would increasing the mass of the substance affect the time needed to complete a phase change at a constant heating rate?</li>
                        </ol>
                      </>
                    ) : simulation.slug === 'gas-laws' ? (
                      <>
                        <ol>
                          <li>A gas occupies 2.5 L at 1.2 atm and 298 K. What will be its volume at 0.8 atm and 320 K?</li>
                          <li>If 1.5 moles of an ideal gas occupies 36.0 L at 300 K, what is the pressure in atmospheres?</li>
                          <li>What is the root mean square speed of oxygen (O<sub>2</sub>) molecules at 25°C? (Molar mass of O<sub>2</sub> = 32.0 g/mol)</li>
                          <li>Explain why gases deviate from ideal behavior at high pressures and low temperatures.</li>
                          <li>A gas mixture contains 0.25 mol of oxygen, 0.50 mol of nitrogen, and 0.15 mol of carbon dioxide. If the total pressure is 1.5 atm, what is the partial pressure of nitrogen?</li>
                          <li>Using the Van der Waals equation, calculate the volume of 1.0 mol of methane at 300 K and 5.0 atm. (For methane, a = 2.283 L²·atm/mol², b = 0.04278 L/mol)</li>
                          <li>Why do lighter gases diffuse faster than heavier gases at the same temperature?</li>
                          <li>Compare the molecular speeds of helium and nitrogen at 300 K. Which has the higher average kinetic energy?</li>
                          <li>If the temperature of a gas doubles (in Kelvin), how does it affect:
                            <ol type="a">
                              <li>The average kinetic energy of the molecules</li>
                              <li>The average speed of the molecules</li>
                              <li>The pressure (if volume is constant)</li>
                            </ol>
                          </li>
                          <li>Calculate the pressure exerted by 2.5 g of oxygen gas in a 1.5 L container at 25°C using both the ideal gas law and Van der Waals equation. Compare the results.</li>
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
