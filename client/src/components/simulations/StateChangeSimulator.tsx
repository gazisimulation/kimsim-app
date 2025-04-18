import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Thermometer, Droplets, Snowflake, Wind } from 'lucide-react';

// Constants for Water (default), Iron, Nitrogen
const substancesData = {
  Water: {
    meltingPoint: 0, // C
    boilingPoint: 100, // C
    heatCapacitySolid: 2.108, // J/gC (ice)
    heatCapacityLiquid: 4.18, // J/gC (water)
    heatCapacityGas: 2.0, // J/gC (steam approx)
    latentHeatFusion: 333.55, // J/g
    latentHeatVaporization: 2257, // J/g
    molarMass: 18.01528, // g/mol
    densitySolid: 0.9167, // g/cm3
    densityLiquid: 1.0, // g/cm3
    densityGas: 0.0006, // g/cm3 approx at 100C
  },
  Iron: {
    meltingPoint: 1538,
    boilingPoint: 2862,
    heatCapacitySolid: 0.449, // J/gC
    heatCapacityLiquid: 0.82, // J/gC
    heatCapacityGas: 0.9, // J/gC approx
    latentHeatFusion: 247, // J/g
    latentHeatVaporization: 6090, // J/g
    molarMass: 55.845,
    densitySolid: 7.874,
    densityLiquid: 6.98,
    densityGas: 0.005, // approx
  },
  Nitrogen: {
    meltingPoint: -210,
    boilingPoint: -196,
    heatCapacitySolid: 1.04, // J/gC
    heatCapacityLiquid: 2.04, // J/gC
    heatCapacityGas: 1.04, // J/gC
    latentHeatFusion: 25.7, // J/g
    latentHeatVaporization: 199, // J/g
    molarMass: 28.0134,
    densitySolid: 1.026, // g/cm3
    densityLiquid: 0.808, // g/cm3
    densityGas: 0.00125, // g/cm3
  },
};

// Default interval in ms
const DEFAULT_INTERVAL_MS = 50;

export default function StateChangeSimulator() {
  // User configurable parameters
  const [substance, setSubstance] = useState('Water');
  const [mass, setMass] = useState(100); // grams
  const [heatingRate, setHeatingRate] = useState(500); // J/s
  const [intervalMs, setIntervalMs] = useState(DEFAULT_INTERVAL_MS);
  
  // Simulation state
  const [temperature, setTemperature] = useState(20); // C
  const [state, setState] = useState('liquid');
  const [energy, setEnergy] = useState(0); // total energy in Joules
  const [heating, setHeating] = useState(0); // +1 heating, -1 cooling, 0 steady
  
  // Refs for interval updates
  const energyRef = useRef(0);
  const heatingRef = useRef(0);
  const temperatureRef = useRef(temperature);
  const stateRef = useRef(state);
  const substanceRef = useRef(substance);
  const massRef = useRef(mass);
  const heatingRateRef = useRef(heatingRate);

  // Initialize substance data
  const data = substancesData[substance as keyof typeof substancesData];

  // Calculate energy for a given temperature and state
  // Energy reference: 0 J at 0C solid phase
  function energyAtTemperature(temp: number, massValue = mass): number {
    if (temp <= data.meltingPoint) {
      // Solid phase
      return massValue * data.heatCapacitySolid * (temp - data.meltingPoint);
    } else if (temp < data.boilingPoint) {
      // Liquid phase
      // Energy = energy at melting point solid + fusion + heat capacity liquid
      return (
        massValue * data.heatCapacitySolid * 0 + // zero at melting point solid
        massValue * data.latentHeatFusion +
        massValue * data.heatCapacityLiquid * (temp - data.meltingPoint)
      );
    } else {
      // Gas phase
      return (
        massValue * data.heatCapacitySolid * 0 +
        massValue * data.latentHeatFusion +
        massValue * data.heatCapacityLiquid * (data.boilingPoint - data.meltingPoint) +
        massValue * data.latentHeatVaporization +
        massValue * data.heatCapacityGas * (temp - data.boilingPoint)
      );
    }
  }

  // Calculate temperature from energy
  function temperatureAtEnergy(energy: number, massValue = mass): number {
    const fusionEnergy = massValue * data.latentHeatFusion;
    const vaporEnergy = massValue * data.latentHeatVaporization;
    const liquidEnergyRange = massValue * data.heatCapacityLiquid * (data.boilingPoint - data.meltingPoint);

    if (energy < 0) {
      // Below melting point solid
      return data.meltingPoint + energy / (massValue * data.heatCapacitySolid);
    } else if (energy < fusionEnergy) {
      // Phase change solid to liquid (melting)
      return data.meltingPoint;
    } else if (energy < fusionEnergy + liquidEnergyRange) {
      // Liquid phase
      return data.meltingPoint + (energy - fusionEnergy) / (massValue * data.heatCapacityLiquid);
    } else if (energy < fusionEnergy + liquidEnergyRange + vaporEnergy) {
      // Phase change liquid to gas (boiling)
      return data.boilingPoint;
    } else {
      // Gas phase
      return (
        data.boilingPoint +
        (energy - fusionEnergy - liquidEnergyRange - vaporEnergy) / (massValue * data.heatCapacityGas)
      );
    }
  }

  // Determine state from temperature and energy
  function determineState(temp: number, energy: number, massValue = mass): string {
    const fusionEnergy = massValue * data.latentHeatFusion;
    const vaporEnergy = massValue * data.latentHeatVaporization;
    const liquidEnergyRange = massValue * data.heatCapacityLiquid * (data.boilingPoint - data.meltingPoint);

    if (energy < 0) {
      return 'solid';
    } else if (energy >= 0 && energy < fusionEnergy) {
      return 'melting';
    } else if (energy >= fusionEnergy && energy < fusionEnergy + liquidEnergyRange) {
      return 'liquid';
    } else if (energy >= fusionEnergy + liquidEnergyRange && energy < fusionEnergy + liquidEnergyRange + vaporEnergy) {
      return 'boiling';
    } else {
      return 'gas';
    }
  }

  // Handle substance change
  useEffect(() => {
    // Reset to room temperature (20°C)
    setTemperature(20);
    const initialEnergy = energyAtTemperature(20);
    setEnergy(initialEnergy);
    energyRef.current = initialEnergy;
    
    const initialState = determineState(20, initialEnergy);
    setState(initialState);
    stateRef.current = initialState;
    
    // Reset heating/cooling
    heatingRef.current = 0;
    setHeating(0);
    
    // Update refs
    temperatureRef.current = 20;
    substanceRef.current = substance;
  }, [substance]);

  // Handle mass change
  useEffect(() => {
    massRef.current = mass;
    // Recalculate energy and temperature
    const newEnergy = energyAtTemperature(temperatureRef.current);
    setEnergy(newEnergy);
    energyRef.current = newEnergy;
    
    // State might change with different mass
    const newState = determineState(temperatureRef.current, newEnergy);
    setState(newState);
    stateRef.current = newState;
  }, [mass]);

  // Handle heating rate change
  useEffect(() => {
    heatingRateRef.current = heatingRate;
  }, [heatingRate]);

  // Handle heating and cooling
  useEffect(() => {
    const interval = setInterval(() => {
      if (heatingRef.current === 0) return;

      const currentMass = massRef.current;
      const currentRate = heatingRateRef.current;
      let newEnergy = energyRef.current + heatingRef.current * currentRate * (intervalMs / 1000);

      // Limit energy to reasonable bounds
      const minEnergy = currentMass * data.heatCapacitySolid * (data.meltingPoint - 100); // arbitrary low
      const maxEnergy = currentMass * data.heatCapacityGas * (data.boilingPoint + 500); // arbitrary high
      
      if (newEnergy < minEnergy) newEnergy = minEnergy;
      if (newEnergy > maxEnergy) newEnergy = maxEnergy;

      energyRef.current = newEnergy;
      setEnergy(newEnergy);

      const newTemp = temperatureAtEnergy(newEnergy, currentMass);
      temperatureRef.current = newTemp;
      setTemperature(parseFloat(newTemp.toFixed(2)));

      const newState = determineState(newTemp, newEnergy, currentMass);
      stateRef.current = newState;
      setState(newState);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [data, intervalMs]);

  const startHeating = () => {
    heatingRef.current = 1;
    setHeating(1);
  };

  const startCooling = () => {
    heatingRef.current = -1;
    setHeating(-1);
  };

  const stopHeatingCooling = () => {
    heatingRef.current = 0;
    setHeating(0);
  };

  // Format energy for display
  function formatEnergy(joules: number): string {
    if (joules > 1000) return (joules / 1000).toFixed(2) + ' kJ';
    return joules.toFixed(2) + ' J';
  }

  // Get phase icon based on state
  const getPhaseIcon = () => {
    switch (state) {
      case 'solid':
      case 'melting':
        return <Snowflake className="h-6 w-6 text-blue-700" />;
      case 'liquid':
      case 'boiling':
        return <Droplets className="h-6 w-6 text-blue-700" />;
      case 'gas':
        return <Wind className="h-6 w-6 text-blue-700" />;
      default:
        return <Thermometer className="h-6 w-6 text-blue-700" />;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4">
      <Card className="w-full lg:w-1/3">
        <CardHeader>
          <CardTitle>Hal Değişimi Simülasyonu</CardTitle>
          <CardDescription>Farklı maddelerin faz geçişlerini keşfedin</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="substance">Madde</Label>
              <Select value={substance} onValueChange={setSubstance}>
                <SelectTrigger id="substance">
                  <SelectValue placeholder="Madde seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Water">Su (H₂O)</SelectItem>
                  <SelectItem value="Iron">Demir (Fe)</SelectItem>
                  <SelectItem value="Nitrogen">Azot (N₂)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="mass">Kütle (g)</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="mass"
                  type="number"
                  min="1"
                  max="1000"
                  value={mass}
                  onChange={(e) => setMass(Number(e.target.value))}
                />
                <span className="text-sm text-gray-500">g</span>
              </div>
            </div>

            <div>
              <Label htmlFor="heatingRate">Isıtma/Soğutma Hızı</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="heatingRate"
                  type="number"
                  min="50"
                  max="2000"
                  value={heatingRate}
                  onChange={(e) => setHeatingRate(Number(e.target.value))}
                />
                <span className="text-sm text-gray-500">J/s</span>
              </div>
            </div>

            <div>
              <Label htmlFor="simulationSpeed">Simülasyon Hızı</Label>
              <div className="pt-2">
                <Slider
                  id="simulationSpeed"
                  min={10}
                  max={200}
                  step={10}
                  defaultValue={[DEFAULT_INTERVAL_MS]}
                  onValueChange={(value) => setIntervalMs(value[0])}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Hızlı</span>
                  <span>Yavaş</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button 
              onClick={startCooling} 
              disabled={heating === -1}
              variant={heating === -1 ? "secondary" : "outline"}
              className="w-1/3"
            >
              Soğut
            </Button>
            <Button 
              onClick={stopHeatingCooling} 
              disabled={heating === 0}
              variant={heating === 0 ? "secondary" : "outline"}
              className="w-1/3 mx-1"
            >
              Durdur
            </Button>
            <Button 
              onClick={startHeating} 
              disabled={heating === 1}
              variant={heating === 1 ? "secondary" : "outline"}
              className="w-1/3"
            >
              Isıt
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full lg:w-2/3 flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle>Simülasyon Sonuçları</CardTitle>
          <CardDescription>
            Mevcut Sıcaklık: {temperature.toFixed(2)}°C | 
            Faz: <span className="capitalize">{state}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="space-y-6">
            {/* State visualization */}
            <div className="relative h-32 w-full rounded-xl border-2 border-gray-300 overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
              {(state === 'solid' || state === 'melting') && (
                <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900 flex flex-col justify-center items-center text-blue-700 dark:text-blue-300 text-xl font-bold">
                  <div className="flex items-center space-x-2">
                    <Snowflake className="h-6 w-6" />
                    <span>{state === 'solid' ? 'Katı' : 'Erime'} ({substance === 'Water' ? 'Buz' : 
                           substance === 'Iron' ? 'Demir' : 'Azot'})</span>
                  </div>
                  {state === 'melting' && <div className="text-sm mt-1">Faz değişimi sürüyor...</div>}
                  <div className="absolute inset-0 bg-blue-200 dark:bg-blue-800 opacity-30 animate-pulse"></div>
                </div>
              )}
              {(state === 'liquid' || state === 'boiling') && (
                <div className="absolute inset-0 bg-blue-300 dark:bg-blue-700 flex flex-col justify-center items-center text-blue-700 dark:text-blue-200 text-xl font-bold overflow-hidden">
                  <div className="flex items-center space-x-2">
                    <Droplets className="h-6 w-6" />
                    <span>{state === 'liquid' ? 'Liquid' : 'Boiling'} ({substance === 'Water' ? 'Water' : substance})</span>
                  </div>
                  {state === 'boiling' && <div className="text-sm mt-1">Phase change in progress...</div>}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-300 dark:from-blue-600 dark:to-blue-700 opacity-40 bg-[length:200%_100%] animate-[wave_2s_linear_infinite]"></div>
                </div>
              )}
              {state === 'gas' && (
                <div className="absolute inset-0 bg-blue-50 dark:bg-blue-950 flex justify-center items-center text-blue-700 dark:text-blue-400 text-xl font-bold">
                  <div className="flex items-center space-x-2">
                    <Wind className="h-6 w-6" />
                    <span>Gas ({substance === 'Water' ? 'Steam' : substance})</span>
                  </div>
                  <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900 opacity-10 animate-[fadeOut_1.5s_forwards]"></div>
                  <div className="absolute inset-0 bg-blue-50 dark:bg-blue-950 opacity-5 animate-[fadeOut_1.5s_0.25s_forwards]"></div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current data table */}
              <div>
                <h3 className="text-lg font-medium mb-2">Mevcut Veriler</h3>
                <table className="w-full border-collapse border dark:border-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="border dark:border-gray-700 px-3 py-2 text-left">Özellik</th>
                      <th className="border dark:border-gray-700 px-3 py-2 text-right">Değer</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border dark:border-gray-700 px-3 py-2">Sıcaklık</td>
                      <td className="border dark:border-gray-700 px-3 py-2 text-right">{temperature.toFixed(2)} °C</td>
                    </tr>
                    <tr>
                      <td className="border dark:border-gray-700 px-3 py-2">Faz</td>
                      <td className="border dark:border-gray-700 px-3 py-2 text-right capitalize flex justify-end items-center">
                        {getPhaseIcon()}
                        <span className="ml-2">{state === 'solid' ? 'Katı' : 
                               state === 'melting' ? 'Erime' : 
                               state === 'liquid' ? 'Sıvı' : 
                               state === 'boiling' ? 'Kaynama' : 'Gaz'}</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="border dark:border-gray-700 px-3 py-2">Enerji</td>
                      <td className="border dark:border-gray-700 px-3 py-2 text-right">{formatEnergy(energy)}</td>
                    </tr>
                    <tr>
                      <td className="border dark:border-gray-700 px-3 py-2">Isıtma Durumu</td>
                      <td className="border dark:border-gray-700 px-3 py-2 text-right">
                        {heating === 1 ? '🔥 Isıtılıyor' : heating === -1 ? '❄️ Soğutuluyor' : '⏸️ Durdu'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Substance properties */}
              <div>
                <h3 className="text-lg font-medium mb-2">Madde Özellikleri</h3>
                <table className="w-full border-collapse border dark:border-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="border dark:border-gray-700 px-3 py-2 text-left">Özellik</th>
                      <th className="border dark:border-gray-700 px-3 py-2 text-right">Değer</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border dark:border-gray-700 px-3 py-2">Erime Noktası</td>
                      <td className="border dark:border-gray-700 px-3 py-2 text-right">{data.meltingPoint} °C</td>
                    </tr>
                    <tr>
                      <td className="border dark:border-gray-700 px-3 py-2">Kaynama Noktası</td>
                      <td className="border dark:border-gray-700 px-3 py-2 text-right">{data.boilingPoint} °C</td>
                    </tr>
                    <tr>
                      <td className="border dark:border-gray-700 px-3 py-2">Isı Kapasitesi (katı)</td>
                      <td className="border dark:border-gray-700 px-3 py-2 text-right">{data.heatCapacitySolid} J/g·°C</td>
                    </tr>
                    <tr>
                      <td className="border dark:border-gray-700 px-3 py-2">Isı Kapasitesi (sıvı)</td>
                      <td className="border dark:border-gray-700 px-3 py-2 text-right">{data.heatCapacityLiquid} J/g·°C</td>
                    </tr>
                    <tr>
                      <td className="border dark:border-gray-700 px-3 py-2">Erime Isısı</td>
                      <td className="border dark:border-gray-700 px-3 py-2 text-right">{data.latentHeatFusion} J/g</td>
                    </tr>
                    <tr>
                      <td className="border dark:border-gray-700 px-3 py-2">Buharlaşma Isısı</td>
                      <td className="border dark:border-gray-700 px-3 py-2 text-right">{data.latentHeatVaporization} J/g</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Animations defined in global CSS */}
    </div>
  );
}