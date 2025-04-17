import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Battery, BatteryFull, BatteryLow, Lightbulb, Zap, Repeat, PlusCircle, MinusCircle, Wrench } from 'lucide-react';

// Battery types and their properties
const BATTERY_TYPES = {
  'zinc-carbon': {
    name: 'Zinc-Carbon',
    anode: 'Zinc',
    cathode: 'Manganese Dioxide',
    electrolyte: 'Ammonium Chloride',
    voltage: 1.5,
    capacity: 1200, // mAh
    internalResistance: 0.8, // Ohms
    rechargeable: false,
    color: '#667085',
    reaction: {
      anode: 'Zn → Zn²⁺ + 2e⁻',
      cathode: '2MnO₂ + H₂O + 2e⁻ → Mn₂O₃ + 2OH⁻',
      overall: 'Zn + 2MnO₂ + H₂O → ZnO + Mn₂O₃ + 2OH⁻'
    }
  },
  'alkaline': {
    name: 'Alkaline',
    anode: 'Zinc',
    cathode: 'Manganese Dioxide',
    electrolyte: 'Potassium Hydroxide',
    voltage: 1.5,
    capacity: 2800, // mAh
    internalResistance: 0.2, // Ohms
    rechargeable: false,
    color: '#0EA5E9',
    reaction: {
      anode: 'Zn + 2OH⁻ → ZnO + H₂O + 2e⁻',
      cathode: '2MnO₂ + H₂O + 2e⁻ → Mn₂O₃ + 2OH⁻',
      overall: 'Zn + 2MnO₂ → ZnO + Mn₂O₃'
    }
  },
  'lithium-ion': {
    name: 'Lithium-Ion',
    anode: 'Graphite (C)',
    cathode: 'Lithium Cobalt Oxide',
    electrolyte: 'Lithium Salt',
    voltage: 3.7,
    capacity: 3200, // mAh
    internalResistance: 0.1, // Ohms
    rechargeable: true,
    color: '#10B981',
    reaction: {
      anode: 'LixC6 → C6 + xLi⁺ + xe⁻',
      cathode: 'Li₁₋ₓCoO₂ + xLi⁺ + xe⁻ → LiCoO₂',
      overall: 'LixC6 + Li₁₋ₓCoO₂ → C6 + LiCoO₂'
    }
  },
  'lead-acid': {
    name: 'Lead-Acid',
    anode: 'Lead',
    cathode: 'Lead Dioxide',
    electrolyte: 'Sulfuric Acid',
    voltage: 2.1,
    capacity: 7000, // mAh
    internalResistance: 0.004, // Ohms
    rechargeable: true,
    color: '#F59E0B',
    reaction: {
      anode: 'Pb + SO₄²⁻ → PbSO₄ + 2e⁻',
      cathode: 'PbO₂ + 4H⁺ + SO₄²⁻ + 2e⁻ → PbSO₄ + 2H₂O',
      overall: 'Pb + PbO₂ + 4H⁺ + 2SO₄²⁻ → 2PbSO₄ + 2H₂O'
    }
  },
  'nickel-metal-hydride': {
    name: 'Nickel-Metal Hydride',
    anode: 'Metal Hydride Alloy',
    cathode: 'Nickel Oxyhydroxide',
    electrolyte: 'Potassium Hydroxide',
    voltage: 1.2,
    capacity: 2500, // mAh
    internalResistance: 0.15, // Ohms
    rechargeable: true,
    color: '#6366F1',
    reaction: {
      anode: 'MH + OH⁻ → M + H₂O + e⁻',
      cathode: 'NiOOH + H₂O + e⁻ → Ni(OH)₂ + OH⁻',
      overall: 'MH + NiOOH → M + Ni(OH)₂'
    }
  }
};

// Load types and their properties
const LOAD_TYPES = {
  'led': {
    name: 'LED Light',
    resistance: 250, // Ohms at standard operating voltage
    icon: <Lightbulb className="h-5 w-5" />,
    variableResistance: false
  },
  'motor': {
    name: 'Small Motor',
    resistance: 50, // Ohms at standard operating conditions
    icon: <Repeat className="h-5 w-5" />,
    variableResistance: true
  },
  'heating': {
    name: 'Heating Element',
    resistance: 20, // Ohms
    icon: <Zap className="h-5 w-5" />,
    variableResistance: false
  },
  'variable': {
    name: 'Variable Resistor',
    resistance: 100, // Ohms (initial)
    icon: <Wrench className="h-5 w-5" />,
    variableResistance: true
  }
};

type BatteryType = keyof typeof BATTERY_TYPES;
type LoadType = keyof typeof LOAD_TYPES;

export default function BatterySimulator() {
  // Battery simulation state
  const [batteryType, setBatteryType] = useState<BatteryType>('alkaline');
  const [loadType, setLoadType] = useState<LoadType>('led');
  const [circuitClosed, setCircuitClosed] = useState(false);
  const [seriesCount, setSeriesCount] = useState(1);
  const [loadResistance, setLoadResistance] = useState(250); // Ohms
  const [batteryCharge, setBatteryCharge] = useState(100); // Percentage
  const [elapsedTime, setElapsedTime] = useState(0); // seconds
  const [dischargeRate, setDischargeRate] = useState(0); // mA
  
  // Canvas and animation refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  
  // Tabs state
  const [activeTab, setActiveTab] = useState('battery-operation');
  
  // Calculate current battery values based on properties and state
  const battery = BATTERY_TYPES[batteryType];
  const load = LOAD_TYPES[loadType];
  
  // Update load resistance when load type changes
  useEffect(() => {
    setLoadResistance(load.resistance);
  }, [loadType, load.resistance]);
  
  // Calculate electrical values
  const totalVoltage = battery.voltage * seriesCount * (batteryCharge / 100);
  const totalInternalResistance = battery.internalResistance * seriesCount;
  const current = circuitClosed 
    ? totalVoltage / (loadResistance + totalInternalResistance) 
    : 0; // A
  const powerOutput = current * totalVoltage; // W
  
  // Calculate discharge rate when circuit is closed
  useEffect(() => {
    if (circuitClosed) {
      // Convert current from A to mA
      const currentInMA = current * 1000;
      setDischargeRate(currentInMA);
    } else {
      setDischargeRate(0);
    }
  }, [circuitClosed, current]);
  
  // Update battery charge based on discharge rate
  useEffect(() => {
    if (circuitClosed && batteryCharge > 0) {
      const interval = setInterval(() => {
        // Calculate how much charge is depleted in one second
        const depletionRate = dischargeRate / battery.capacity * 100; // percent per second
        
        // Update battery charge and elapsed time
        setBatteryCharge(prev => Math.max(0, prev - depletionRate));
        setElapsedTime(prev => prev + 1);
        
        // If battery is depleted, open the circuit
        if (batteryCharge <= 0) {
          setCircuitClosed(false);
        }
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [circuitClosed, dischargeRate, batteryCharge, battery.capacity]);
  
  // Reset the simulation
  const resetSimulation = () => {
    setCircuitClosed(false);
    setBatteryCharge(100);
    setElapsedTime(0);
    setDischargeRate(0);
    
    // Reset animations
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    // Redraw the visualization
    drawBatteryVisualization();
  };
  
  // Recharge battery (for rechargeable types)
  const rechargeBattery = () => {
    if (battery.rechargeable) {
      setCircuitClosed(false);
      setBatteryCharge(100);
      drawBatteryVisualization();
    }
  };
  
  // Effect to start animation when component mounts
  useEffect(() => {
    drawBatteryVisualization();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  // Effect to update visualization when parameters change
  useEffect(() => {
    drawBatteryVisualization();
  }, [batteryType, circuitClosed, seriesCount, batteryCharge, loadType, loadResistance]);
  
  // Draw the battery and circuit visualization
  const drawBatteryVisualization = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set up dimensions
    const width = canvas.width;
    const height = canvas.height;
    const batteryWidth = 80;
    const batteryHeight = 140;
    const batterySpacing = 30;
    const circuitWidth = width - 100;
    const circuitHeight = height - 100;
    
    // Draw background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);
    
    // Draw circuit wires
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 4;
    ctx.beginPath();
    
    // Calculate positions based on number of batteries
    const totalBatteriesWidth = seriesCount * (batteryWidth + batterySpacing) - batterySpacing;
    const startX = (width - totalBatteriesWidth) / 2;
    const startY = (height - batteryHeight) / 2;
    
    // Draw batteries and connecting wires
    for (let i = 0; i < seriesCount; i++) {
      const batteryX = startX + i * (batteryWidth + batterySpacing);
      const batteryY = startY;
      
      // Draw battery case
      ctx.fillStyle = battery.color;
      ctx.fillRect(batteryX, batteryY, batteryWidth, batteryHeight);
      
      // Draw battery terminal indicators
      ctx.fillStyle = '#fff';
      ctx.fillRect(batteryX + batteryWidth / 4, batteryY - 5, batteryWidth / 2, 5);
      
      // Draw + and - symbols
      ctx.fillStyle = '#000';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // + on top
      ctx.fillText('+', batteryX + batteryWidth / 2, batteryY - 10);
      
      // - on bottom
      ctx.fillText('-', batteryX + batteryWidth / 2, batteryY + batteryHeight + 10);
      
      // Draw battery charge level
      const chargeHeight = (batteryCharge / 100) * (batteryHeight - 20);
      ctx.fillStyle = getChargeColor(batteryCharge);
      ctx.fillRect(
        batteryX + 10, 
        batteryY + batteryHeight - 10 - chargeHeight, 
        batteryWidth - 20, 
        chargeHeight
      );
      
      // Draw battery label
      ctx.fillStyle = '#fff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(battery.name, batteryX + batteryWidth / 2, batteryY + batteryHeight / 2);
      
      // Draw voltage
      ctx.fillText(
        `${(battery.voltage * (batteryCharge / 100)).toFixed(1)}V`, 
        batteryX + batteryWidth / 2, 
        batteryY + batteryHeight / 2 + 20
      );
      
      // Connect batteries in series with wires if there are multiple
      if (i > 0) {
        const prevBatteryX = startX + (i - 1) * (batteryWidth + batterySpacing);
        
        // Draw wire connecting - of previous to + of current
        ctx.beginPath();
        ctx.moveTo(prevBatteryX + batteryWidth / 2, batteryY + batteryHeight + 15);
        ctx.lineTo(prevBatteryX + batteryWidth / 2, batteryY + batteryHeight + 30);
        ctx.lineTo(batteryX + batteryWidth / 2, batteryY + batteryHeight + 30);
        ctx.lineTo(batteryX + batteryWidth / 2, batteryY - 15);
        ctx.stroke();
      }
    }
    
    // Draw external circuit with load
    const lastBatteryX = startX + (seriesCount - 1) * (batteryWidth + batterySpacing);
    const loadX = width / 2;
    const loadY = batteryHeight + startY + 50;
    const loadRadius = 30;
    
    // Draw wires to load
    ctx.beginPath();
    ctx.moveTo(startX + batteryWidth / 2, startY - 15); // From first battery +
    ctx.lineTo(startX + batteryWidth / 2, startY - 40);
    ctx.lineTo(loadX - loadRadius - 20, startY - 40);
    ctx.lineTo(loadX - loadRadius - 20, loadY);
    ctx.lineTo(loadX - loadRadius, loadY);
    ctx.stroke();
    
    // Draw from last battery - to load
    ctx.beginPath();
    ctx.moveTo(lastBatteryX + batteryWidth / 2, startY + batteryHeight + 15); // From last battery -
    ctx.lineTo(lastBatteryX + batteryWidth / 2, loadY + loadRadius + 20);
    ctx.lineTo(loadX + loadRadius + 20, loadY + loadRadius + 20);
    ctx.lineTo(loadX + loadRadius + 20, loadY);
    ctx.lineTo(loadX + loadRadius, loadY);
    ctx.stroke();
    
    // Draw switch
    const switchX = loadX - loadRadius - 70;
    const switchY = startY - 40;
    const switchWidth = 30;
    const switchHeight = 15;
    
    ctx.fillStyle = '#374151';
    ctx.fillRect(switchX, switchY - switchHeight / 2, switchWidth, switchHeight);
    
    // Draw switch state (on/off)
    if (circuitClosed) {
      ctx.fillStyle = '#10B981';
      ctx.fillRect(switchX + 5, switchY - 5, 20, 10);
    } else {
      ctx.fillStyle = '#EF4444';
      ctx.fillRect(switchX + 5, switchY - 5, 20, 10);
      
      // Draw break in the circuit
      ctx.strokeStyle = '#f8fafc'; // Background color to create break
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(switchX + switchWidth / 2 - 5, switchY);
      ctx.lineTo(switchX + switchWidth / 2 + 5, switchY);
      ctx.stroke();
      
      // Restore line settings
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 4;
    }
    
    // Draw load (resistor, LED, etc)
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.arc(loadX, loadY, loadRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw load icon
    ctx.fillStyle = '#fff';
    ctx.font = '15px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Render SVG icon as text
    ctx.fillText(LOAD_TYPES[loadType].name, loadX, loadY - 5);
    ctx.fillText(`${loadResistance} Ω`, loadX, loadY + 15);
    
    // Draw current flow animation if circuit is closed
    if (circuitClosed && batteryCharge > 0) {
      drawCurrentFlow(ctx, startX, startY, batteryWidth, batteryHeight, loadX, loadY, loadRadius, seriesCount, batterySpacing);
    }
  };
  
  // Helper to get color based on charge level
  const getChargeColor = (charge: number): string => {
    if (charge > 70) return '#22C55E'; // Green
    if (charge > 30) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };
  
  // Draw animated current flow
  const drawCurrentFlow = (
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    batteryWidth: number,
    batteryHeight: number,
    loadX: number,
    loadY: number,
    loadRadius: number,
    seriesCount: number,
    batterySpacing: number
  ) => {
    // Calculate positions
    const lastBatteryX = startX + (seriesCount - 1) * (batteryWidth + batterySpacing);
    
    // Animation frames
    const animate = (timestamp: number) => {
      if (!lastFrameTimeRef.current) {
        lastFrameTimeRef.current = timestamp;
      }
      
      const elapsed = timestamp - lastFrameTimeRef.current;
      
      // Update animation every 50ms
      if (elapsed > 50) {
        lastFrameTimeRef.current = timestamp;
        
        // Clear previous electrons
        ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
        
        // Redraw static elements
        drawBatteryVisualization();
        
        // Draw moving electrons
        const speed = current * 10; // Adjust speed based on current
        const numElectrons = Math.ceil(current * 20); // Number based on current
        
        // Calculate key points in the circuit for animation
        const points = [
          { x: startX + batteryWidth / 2, y: startY - 15 }, // First battery +
          { x: startX + batteryWidth / 2, y: startY - 40 },
          { x: loadX - loadRadius - 20, y: startY - 40 },
          { x: loadX - loadRadius - 20, y: loadY },
          { x: loadX - loadRadius, y: loadY }, // Load input
          { x: loadX + loadRadius, y: loadY }, // Load output
          { x: loadX + loadRadius + 20, y: loadY },
          { x: loadX + loadRadius + 20, y: loadY + loadRadius + 20 },
          { x: lastBatteryX + batteryWidth / 2, y: loadY + loadRadius + 20 },
          { x: lastBatteryX + batteryWidth / 2, y: startY + batteryHeight + 15 } // Last battery -
        ];
        
        // Draw electrons along the circuit path
        const totalPathLength = calculatePathLength(points);
        
        for (let i = 0; i < numElectrons; i++) {
          // Calculate position along the path based on time
          const offset = (timestamp / 1000 * speed + i * (totalPathLength / numElectrons)) % totalPathLength;
          const pos = getPositionAlongPath(points, offset);
          
          // Draw electron
          ctx.fillStyle = '#3B82F6';
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      if (circuitClosed && batteryCharge > 0) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    animationRef.current = requestAnimationFrame(animate);
  };
  
  // Helper to calculate total path length
  const calculatePathLength = (points: { x: number, y: number }[]): number => {
    let length = 0;
    for (let i = 1; i < points.length; i++) {
      length += Math.sqrt(
        Math.pow(points[i].x - points[i-1].x, 2) + 
        Math.pow(points[i].y - points[i-1].y, 2)
      );
    }
    return length;
  };
  
  // Helper to get position along a path
  const getPositionAlongPath = (points: { x: number, y: number }[], offset: number): { x: number, y: number } => {
    let distanceTraveled = 0;
    
    for (let i = 1; i < points.length; i++) {
      const segmentLength = Math.sqrt(
        Math.pow(points[i].x - points[i-1].x, 2) + 
        Math.pow(points[i].y - points[i-1].y, 2)
      );
      
      if (distanceTraveled + segmentLength >= offset) {
        // Calculate position along this segment
        const segmentOffset = (offset - distanceTraveled) / segmentLength;
        return {
          x: points[i-1].x + (points[i].x - points[i-1].x) * segmentOffset,
          y: points[i-1].y + (points[i].y - points[i-1].y) * segmentOffset
        };
      }
      
      distanceTraveled += segmentLength;
    }
    
    // Default to the last point if somehow we're past the end
    return points[points.length - 1];
  };
  
  // Format time display (seconds to MM:SS)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="flex flex-col gap-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="battery-operation" className="flex items-center gap-2">
            <Battery className="h-4 w-4" /> Battery Operation
          </TabsTrigger>
          <TabsTrigger value="battery-types" className="flex items-center gap-2">
            <BatteryFull className="h-4 w-4" /> Battery Types
          </TabsTrigger>
          <TabsTrigger value="electrochemistry" className="flex items-center gap-2">
            <Zap className="h-4 w-4" /> Electrochemistry
          </TabsTrigger>
        </TabsList>
      
        <TabsContent value="battery-operation" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-6">
            <Card className="w-full md:w-1/3">
              <CardHeader>
                <CardTitle>Circuit Controls</CardTitle>
                <CardDescription>Configure your battery and circuit</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="battery-type">Battery Type</Label>
                  <Select value={batteryType} onValueChange={(value: BatteryType) => setBatteryType(value)}>
                    <SelectTrigger id="battery-type">
                      <SelectValue placeholder="Select battery" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(BATTERY_TYPES).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: value.color }}></div>
                            {value.name} {value.rechargeable && '(Rechargeable)'}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="load-type">Load Type</Label>
                  <Select value={loadType} onValueChange={(value: LoadType) => setLoadType(value)}>
                    <SelectTrigger id="load-type">
                      <SelectValue placeholder="Select load" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(LOAD_TYPES).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            {value.icon}
                            {value.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {LOAD_TYPES[loadType].variableResistance && (
                  <div className="space-y-2">
                    <Label>Load Resistance (Ω)</Label>
                    <div className="flex items-center gap-2">
                      <Slider 
                        min={10} 
                        max={500} 
                        step={5} 
                        value={[loadResistance]} 
                        onValueChange={(values) => setLoadResistance(values[0])} 
                      />
                      <span className="w-12 text-right">{loadResistance}Ω</span>
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label>Batteries in Series</Label>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => seriesCount > 1 && setSeriesCount(seriesCount - 1)}
                      disabled={seriesCount <= 1}
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{seriesCount}</span>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => seriesCount < 4 && setSeriesCount(seriesCount + 1)}
                      disabled={seriesCount >= 4}
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="circuit-switch">Circuit State</Label>
                    <Switch 
                      id="circuit-switch" 
                      checked={circuitClosed}
                      onCheckedChange={setCircuitClosed}
                      disabled={batteryCharge <= 0}
                    />
                  </div>
                  <div className="text-sm text-gray-500">
                    {circuitClosed ? 'Circuit closed (current flowing)' : 'Circuit open (no current)'}
                  </div>
                </div>
                
                <div className="pt-4 flex flex-col gap-2">
                  <Button onClick={resetSimulation} variant="outline" className="w-full">
                    Reset Simulation
                  </Button>
                  
                  {battery.rechargeable && (
                    <Button 
                      onClick={rechargeBattery} 
                      variant="outline" 
                      className="w-full"
                      disabled={batteryCharge >= 100}
                    >
                      Recharge Battery
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className="w-full md:w-2/3">
              <CardHeader>
                <CardTitle>Battery Circuit Visualization</CardTitle>
                <CardDescription>
                  <div className="flex items-center gap-2">
                    Current State: 
                    <Badge variant={circuitClosed ? "default" : "outline"}>
                      {circuitClosed ? "Circuit Closed" : "Circuit Open"}
                    </Badge>
                    <Badge variant={batteryCharge > 0 ? "default" : "destructive"}>
                      {batteryCharge > 0 ? 
                        `Battery ${batteryCharge.toFixed(1)}%` : 
                        "Battery Depleted"
                      }
                    </Badge>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full bg-slate-50 dark:bg-slate-900 rounded-md mb-4">
                  <canvas 
                    ref={canvasRef} 
                    className="w-full h-full"
                    width={800}
                    height={400}
                  />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-md p-3">
                    <h3 className="text-sm font-medium">Voltage</h3>
                    <p className="text-2xl font-bold">
                      {totalVoltage.toFixed(2)}V
                      <span className="text-xs text-gray-500 ml-1">
                        ({(battery.voltage * seriesCount).toFixed(2)}V max)
                      </span>
                    </p>
                  </div>
                  
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-md p-3">
                    <h3 className="text-sm font-medium">Current</h3>
                    <p className="text-2xl font-bold">
                      {(current * 1000).toFixed(2)}mA
                    </p>
                  </div>
                  
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-md p-3">
                    <h3 className="text-sm font-medium">Power</h3>
                    <p className="text-2xl font-bold">
                      {(powerOutput * 1000).toFixed(2)}mW
                    </p>
                  </div>
                  
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-md p-3">
                    <h3 className="text-sm font-medium">Battery Life</h3>
                    <p className="text-2xl font-bold">
                      {dischargeRate > 0 
                        ? formatTime(Math.round((batteryCharge / 100) * battery.capacity / dischargeRate * 3600)) 
                        : '∞'}
                    </p>
                  </div>
                  
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-md p-3">
                    <h3 className="text-sm font-medium">Elapsed Time</h3>
                    <p className="text-2xl font-bold">
                      {formatTime(elapsedTime)}
                    </p>
                  </div>
                  
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-md p-3">
                    <h3 className="text-sm font-medium">Battery Capacity</h3>
                    <p className="text-2xl font-bold">
                      {battery.capacity}mAh
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="battery-types" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(BATTERY_TYPES).map(([key, value]) => (
              <Card key={key} className={`border-l-4`} style={{ borderLeftColor: value.color }}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{value.name}</span>
                    {value.rechargeable && (
                      <Badge variant="outline" className="ml-2">Rechargeable</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {value.voltage}V, {value.capacity}mAh
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium mb-1">Components</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          <li><span className="font-medium">Anode:</span> {value.anode}</li>
                          <li><span className="font-medium">Cathode:</span> {value.cathode}</li>
                          <li><span className="font-medium">Electrolyte:</span> {value.electrolyte}</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">Characteristics</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          <li><span className="font-medium">Voltage:</span> {value.voltage}V</li>
                          <li><span className="font-medium">Capacity:</span> {value.capacity}mAh</li>
                          <li><span className="font-medium">Int. Resistance:</span> {value.internalResistance}Ω</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-1">Applications</h4>
                      <p className="text-sm">
                        {key === 'zinc-carbon' && 'Low-drain devices like remote controls, wall clocks, and basic electronics.'}
                        {key === 'alkaline' && 'Medium-drain devices like toys, flashlights, portable audio players, and cameras.'}
                        {key === 'lithium-ion' && 'High-performance devices like smartphones, laptops, electric vehicles, and power tools.'}
                        {key === 'lead-acid' && 'Automotive starter batteries, uninterruptible power supplies (UPS), and backup power systems.'}
                        {key === 'nickel-metal-hydride' && 'Hybrid vehicles, digital cameras, wireless electronics, and portable power tools.'}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-1">Advantages / Disadvantages</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="font-medium text-green-600 dark:text-green-400">Pros:</p>
                          <ul className="list-disc list-inside space-y-1">
                            {key === 'zinc-carbon' && (
                              <>
                                <li>Inexpensive</li>
                                <li>Widely available</li>
                                <li>Leak resistant</li>
                              </>
                            )}
                            {key === 'alkaline' && (
                              <>
                                <li>Higher capacity</li>
                                <li>Longer shelf life</li>
                                <li>Better for high-drain use</li>
                              </>
                            )}
                            {key === 'lithium-ion' && (
                              <>
                                <li>High energy density</li>
                                <li>Low self-discharge</li>
                                <li>No memory effect</li>
                              </>
                            )}
                            {key === 'lead-acid' && (
                              <>
                                <li>Reliable and durable</li>
                                <li>Inexpensive</li>
                                <li>High surge current</li>
                              </>
                            )}
                            {key === 'nickel-metal-hydride' && (
                              <>
                                <li>Higher capacity than NiCd</li>
                                <li>Less prone to memory effect</li>
                                <li>Environmentally friendly</li>
                              </>
                            )}
                          </ul>
                        </div>
                        <div>
                          <p className="font-medium text-red-600 dark:text-red-400">Cons:</p>
                          <ul className="list-disc list-inside space-y-1">
                            {key === 'zinc-carbon' && (
                              <>
                                <li>Low capacity</li>
                                <li>Poor performance in cold</li>
                                <li>Non-rechargeable</li>
                              </>
                            )}
                            {key === 'alkaline' && (
                              <>
                                <li>Higher cost than zinc-carbon</li>
                                <li>Non-rechargeable</li>
                                <li>Environmental concerns</li>
                              </>
                            )}
                            {key === 'lithium-ion' && (
                              <>
                                <li>Degrades over time</li>
                                <li>Safety concerns (fire risk)</li>
                                <li>Higher cost</li>
                              </>
                            )}
                            {key === 'lead-acid' && (
                              <>
                                <li>Heavy and bulky</li>
                                <li>Contains toxic lead</li>
                                <li>Limited cycle life</li>
                              </>
                            )}
                            {key === 'nickel-metal-hydride' && (
                              <>
                                <li>High self-discharge rate</li>
                                <li>Less efficient than Li-ion</li>
                                <li>Performs poorly in cold</li>
                              </>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="electrochemistry" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Electrochemical Reactions</CardTitle>
              <CardDescription>
                Choose a battery type to see its chemical reactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <Label htmlFor="reaction-battery-type">Battery Type</Label>
                    <Select value={batteryType} onValueChange={(value: BatteryType) => setBatteryType(value)}>
                      <SelectTrigger id="reaction-battery-type" className="w-full">
                        <SelectValue placeholder="Select battery" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(BATTERY_TYPES).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: value.color }}></div>
                              {value.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-md">
                    <h3 className="text-lg font-medium mb-2">{BATTERY_TYPES[batteryType].name} Battery</h3>
                    <div className="mb-4 grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium">Anode (Negative)</h4>
                        <p>{BATTERY_TYPES[batteryType].anode}</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Cathode (Positive)</h4>
                        <p>{BATTERY_TYPES[batteryType].cathode}</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Electrolyte</h4>
                        <p>{BATTERY_TYPES[batteryType].electrolyte}</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Standard Voltage</h4>
                        <p>{BATTERY_TYPES[batteryType].voltage}V</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium">Anode Half-Reaction (Oxidation)</h4>
                        <p className="py-1 px-2 bg-white dark:bg-slate-700 rounded">
                          {BATTERY_TYPES[batteryType].reaction.anode}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium">Cathode Half-Reaction (Reduction)</h4>
                        <p className="py-1 px-2 bg-white dark:bg-slate-700 rounded">
                          {BATTERY_TYPES[batteryType].reaction.cathode}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium">Overall Reaction</h4>
                        <p className="py-1 px-2 bg-white dark:bg-slate-700 rounded font-medium">
                          {BATTERY_TYPES[batteryType].reaction.overall}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">How Batteries Work</h3>
                  <div className="prose dark:prose-invert">
                    <p>A battery is an electrochemical cell (or connected group of cells) that converts stored chemical energy into electrical energy through redox reactions.</p>
                    
                    <h4>Key Concepts</h4>
                    <ul>
                      <li><strong>Electrochemical Cell:</strong> Contains an anode, cathode, and electrolyte.</li>
                      <li><strong>Anode:</strong> The negative electrode where oxidation occurs (electrons are lost).</li>
                      <li><strong>Cathode:</strong> The positive electrode where reduction occurs (electrons are gained).</li>
                      <li><strong>Electrolyte:</strong> Conducts ions between electrodes but blocks electron flow.</li>
                      <li><strong>External Circuit:</strong> Path for electrons to flow from anode to cathode.</li>
                    </ul>
                    
                    <h4>Operating Principles</h4>
                    <ol>
                      <li>When a battery is connected to a circuit, a chemical reaction at the anode releases electrons.</li>
                      <li>These electrons flow through the external circuit, providing electrical energy.</li>
                      <li>Electrons are consumed at the cathode in a reduction reaction.</li>
                      <li>Ions flow through the electrolyte to maintain electrical neutrality.</li>
                      <li>This flow of electrons creates an electric current.</li>
                    </ol>
                    
                    <h4>Primary vs. Secondary Batteries</h4>
                    <ul>
                      <li><strong>Primary Batteries:</strong> Non-rechargeable, one-time use (e.g., zinc-carbon, alkaline)</li>
                      <li><strong>Secondary Batteries:</strong> Rechargeable, chemical reactions can be reversed (e.g., lithium-ion, lead-acid)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}