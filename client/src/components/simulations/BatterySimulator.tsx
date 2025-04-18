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
    name: 'Çinko-Karbon',
    anode: 'Çinko',
    cathode: 'Manganez Dioksit',
    electrolyte: 'Amonyum Klorür',
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
    name: 'Alkalin',
    anode: 'Çinko',
    cathode: 'Manganez Dioksit',
    electrolyte: 'Potasyum Hidroksit',
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
    name: 'Lityum-İyon',
    anode: 'Grafit (C)',
    cathode: 'Lityum Kobalt Oksit',
    electrolyte: 'Lityum Tuzu',
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
    name: 'Kurşun-Asit',
    anode: 'Kurşun',
    cathode: 'Kurşun Dioksit',
    electrolyte: 'Sülfürik Asit',
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
    name: 'Nikel-Metal Hidrür',
    anode: 'Metal Hidrür Alaşımı',
    cathode: 'Nikel Oksit Hidroksit',
    electrolyte: 'Potasyum Hidroksit',
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
    name: 'LED Işık',
    resistance: 250, // Ohms at standard operating voltage
    icon: <Lightbulb className="h-5 w-5" />,
    variableResistance: false
  },
  'motor': {
    name: 'Küçük Motor',
    resistance: 50, // Ohms at standard operating conditions
    icon: <Repeat className="h-5 w-5" />,
    variableResistance: true
  },
  'heating': {
    name: 'Isıtma Elemanı',
    resistance: 20, // Ohms
    icon: <Zap className="h-5 w-5" />,
    variableResistance: false
  },
  'variable': {
    name: 'Değişken Direnç',
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
            <Battery className="h-4 w-4" /> Pil İşlemi
          </TabsTrigger>
          <TabsTrigger value="battery-types" className="flex items-center gap-2">
            <BatteryFull className="h-4 w-4" /> Pil Türleri
          </TabsTrigger>
          <TabsTrigger value="electrochemistry" className="flex items-center gap-2">
            <Zap className="h-4 w-4" /> Elektrokimya
          </TabsTrigger>
        </TabsList>
      
        <TabsContent value="battery-operation" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-6">
            <Card className="w-full md:w-1/3">
              <CardHeader>
                <CardTitle>Devre Kontrolleri</CardTitle>
                <CardDescription>Pilinizi ve devrenizi yapılandırın</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="battery-type">Pil Türü</Label>
                  <Select value={batteryType} onValueChange={(value: BatteryType) => setBatteryType(value)}>
                    <SelectTrigger id="battery-type">
                      <SelectValue placeholder="Pil seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(BATTERY_TYPES).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: value.color }}></div>
                            {value.name} {value.rechargeable && '(Şarj Edilebilir)'}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="load-type">Yük Türü</Label>
                  <Select value={loadType} onValueChange={(value: LoadType) => setLoadType(value)}>
                    <SelectTrigger id="load-type">
                      <SelectValue placeholder="Yük seçin" />
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
                    <Label>Yük Direnci (Ω)</Label>
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
                  <Label>Seri Bağlı Piller</Label>
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
                    <Label htmlFor="circuit-switch">Devre Durumu</Label>
                    <Switch 
                      id="circuit-switch" 
                      checked={circuitClosed}
                      onCheckedChange={setCircuitClosed}
                      disabled={batteryCharge <= 0}
                    />
                  </div>
                  <div className="text-sm text-gray-500">
                    {circuitClosed ? 'Devre kapalı (akım geçiyor)' : 'Devre açık (akım yok)'}
                  </div>
                </div>
                
                <div className="pt-4 flex flex-col gap-2">
                  <Button onClick={resetSimulation} variant="outline" className="w-full">
                    Simülasyonu Sıfırla
                  </Button>
                  
                  {battery.rechargeable && (
                    <Button 
                      onClick={rechargeBattery} 
                      variant="outline" 
                      className="w-full"
                      disabled={batteryCharge >= 100}
                    >
                      Pili Şarj Et
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className="w-full md:w-2/3">
              <CardHeader>
                <CardTitle>Pil Devre Görselleştirmesi</CardTitle>
                <CardDescription>
                  <div className="flex items-center gap-2">
                    Mevcut Durum: 
                    <Badge variant={circuitClosed ? "default" : "outline"}>
                      {circuitClosed ? "Devre Kapalı" : "Devre Açık"}
                    </Badge>
                    <Badge variant={batteryCharge > 0 ? "default" : "destructive"}>
                      {batteryCharge > 0 ? 
                        `Pil ${batteryCharge.toFixed(1)}%` : 
                        "Pil Tükendi"
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
                    <h3 className="text-sm font-medium">Voltaj</h3>
                    <p className="text-2xl font-bold">
                      {totalVoltage.toFixed(2)}V
                      <span className="text-xs text-gray-500 ml-1">
                        ({(battery.voltage * seriesCount).toFixed(2)}V maks)
                      </span>
                    </p>
                  </div>
                  
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-md p-3">
                    <h3 className="text-sm font-medium">Akım</h3>
                    <p className="text-2xl font-bold">
                      {(current * 1000).toFixed(2)}mA
                    </p>
                  </div>
                  
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-md p-3">
                    <h3 className="text-sm font-medium">Güç</h3>
                    <p className="text-2xl font-bold">
                      {(powerOutput * 1000).toFixed(2)}mW
                    </p>
                  </div>
                  
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-md p-3">
                    <h3 className="text-sm font-medium">Pil Ömrü</h3>
                    <p className="text-2xl font-bold">
                      {dischargeRate > 0 
                        ? formatTime(Math.round((batteryCharge / 100) * battery.capacity / dischargeRate * 3600)) 
                        : '∞'}
                    </p>
                  </div>
                  
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-md p-3">
                    <h3 className="text-sm font-medium">Geçen Süre</h3>
                    <p className="text-2xl font-bold">
                      {formatTime(elapsedTime)}
                    </p>
                  </div>
                  
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-md p-3">
                    <h3 className="text-sm font-medium">Pil Kapasitesi</h3>
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
                      <Badge variant="outline" className="ml-2">Şarj Edilebilir</Badge>
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
                        <h4 className="text-sm font-medium mb-1">Bileşenler</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          <li><span className="font-medium">Anot:</span> {value.anode}</li>
                          <li><span className="font-medium">Katot:</span> {value.cathode}</li>
                          <li><span className="font-medium">Elektrolit:</span> {value.electrolyte}</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">Özellikler</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          <li><span className="font-medium">Voltaj:</span> {value.voltage}V</li>
                          <li><span className="font-medium">Kapasite:</span> {value.capacity}mAh</li>
                          <li><span className="font-medium">İç Direnç:</span> {value.internalResistance}Ω</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-1">Uygulamalar</h4>
                      <p className="text-sm">
                        {key === 'zinc-carbon' && 'Düşük akım tüketen cihazlar, örneğin uzaktan kumandalar, duvar saatleri ve temel elektronik cihazlar.'}
                        {key === 'alkaline' && 'Orta akım tüketen cihazlar, örneğin oyuncaklar, el fenerleri, taşınabilir ses çalarlar ve kameralar.'}
                        {key === 'lithium-ion' && 'Yüksek performanslı cihazlar, örneğin akıllı telefonlar, dizüstü bilgisayarlar, elektrikli araçlar ve güç aletleri.'}
                        {key === 'lead-acid' && 'Otomobil marş pilleri, kesintisiz güç kaynakları (UPS) ve yedek güç sistemleri.'}
                        {key === 'nickel-metal-hydride' && 'Hibrit araçlar, dijital kameralar, kablosuz elektronik cihazlar ve taşınabilir güç aletleri.'}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-1">Avantajlar / Dezavantajlar</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="font-medium text-green-600 dark:text-green-400">Artıları:</p>
                          <ul className="list-disc list-inside space-y-1">
                            {key === 'zinc-carbon' && (
                              <>
                                <li>Ucuz</li>
                                <li>Geniş çapta mevcut</li>
                                <li>Sızıntıya dayanıklı</li>
                              </>
                            )}
                            {key === 'alkaline' && (
                              <>
                                <li>Daha yüksek kapasite</li>
                                <li>Daha uzun raf ömrü</li>
                                <li>Yüksek akım tüketen kullanımlar için daha iyi</li>
                              </>
                            )}
                            {key === 'lithium-ion' && (
                              <>
                                <li>Yüksek enerji yoğunluğu</li>
                                <li>Düşük kendi kendine deşarj</li>
                                <li>Bellek etkisi yok</li>
                              </>
                            )}
                            {key === 'lead-acid' && (
                              <>
                                <li>Güvenilir ve dayanıklı</li>
                                <li>Ucuz</li>
                                <li>Yüksek ani akım</li>
                              </>
                            )}
                            {key === 'nickel-metal-hydride' && (
                              <>
                                <li>NiCd'den daha yüksek kapasite</li>
                                <li>Bellek etkisine daha az yatkın</li>
                                <li>Çevre dostu</li>
                              </>
                            )}
                          </ul>
                        </div>
                        <div>
                          <p className="font-medium text-red-600 dark:text-red-400">Eksileri:</p>
                          <ul className="list-disc list-inside space-y-1">
                            {key === 'zinc-carbon' && (
                              <>
                                <li>Düşük kapasite</li>
                                <li>Soğukta kötü performans</li>
                                <li>Şarj edilemez</li>
                              </>
                            )}
                            {key === 'alkaline' && (
                              <>
                                <li>Çinko-karbondan daha pahalı</li>
                                <li>Şarj edilemez</li>
                                <li>Çevresel endişeler</li>
                              </>
                            )}
                            {key === 'lithium-ion' && (
                              <>
                                <li>Zamanla bozulur</li>
                                <li>Güvenlik endişeleri (yangın riski)</li>
                                <li>Daha yüksek maliyet</li>
                              </>
                            )}
                            {key === 'lead-acid' && (
                              <>
                                <li>Ağır ve hantal</li>
                                <li>Toksik kurşun içerir</li>
                                <li>Sınırlı döngü ömrü</li>
                              </>
                            )}
                            {key === 'nickel-metal-hydride' && (
                              <>
                                <li>Yüksek kendi kendine deşarj hızı</li>
                                <li>Li-iyondan daha az verimli</li>
                                <li>Soğukta kötü performans gösterir</li>
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
              <CardTitle>Elektrokimyasal Tepkimeler</CardTitle>
              <CardDescription>
                Kimyasal tepkimelerini görmek için bir pil türü seçin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <Label htmlFor="reaction-battery-type">Pil Türü</Label>
                    <Select value={batteryType} onValueChange={(value: BatteryType) => setBatteryType(value)}>
                      <SelectTrigger id="reaction-battery-type" className="w-full">
                        <SelectValue placeholder="Pil seçin" />
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
                    <h3 className="text-lg font-medium mb-2">{BATTERY_TYPES[batteryType].name} Pil</h3>
                    <div className="mb-4 grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium">Anot (Negatif)</h4>
                        <p>{BATTERY_TYPES[batteryType].anode}</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Katot (Pozitif)</h4>
                        <p>{BATTERY_TYPES[batteryType].cathode}</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Elektrolit</h4>
                        <p>{BATTERY_TYPES[batteryType].electrolyte}</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Standart Voltaj</h4>
                        <p>{BATTERY_TYPES[batteryType].voltage}V</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium">Anot Yarı Tepkimesi (Oksidasyon)</h4>
                        <p className="py-1 px-2 bg-white dark:bg-slate-700 rounded">
                          {BATTERY_TYPES[batteryType].reaction.anode}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium">Katot Yarı Tepkimesi (Redüksiyon)</h4>
                        <p className="py-1 px-2 bg-white dark:bg-slate-700 rounded">
                          {BATTERY_TYPES[batteryType].reaction.cathode}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium">Toplam Tepkime</h4>
                        <p className="py-1 px-2 bg-white dark:bg-slate-700 rounded font-medium">
                          {BATTERY_TYPES[batteryType].reaction.overall}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Piller Nasıl Çalışır</h3>
                  <div className="prose dark:prose-invert">
                    <p>Bir pil, depolanmış kimyasal enerjiyi redoks tepkimeleri aracılığıyla elektrik enerjisine dönüştüren elektrokimyasal bir hücredir (veya birbirine bağlı hücre grubudur).</p>
                    
                    <h4>Temel Kavramlar</h4>
                    <ul>
                      <li><strong>Elektrokimyasal Hücre:</strong> Bir anot, katot ve elektrolit içerir.</li>
                      <li><strong>Anot:</strong> Oksidasyonun gerçekleştiği negatif elektrot (elektronlar kaybedilir).</li>
                      <li><strong>Katot:</strong> Redüksiyonun gerçekleştiği pozitif elektrot (elektronlar kazanılır).</li>
                      <li><strong>Elektrolit:</strong> Elektrotlar arasında iyonları iletir ancak elektron akışını engeller.</li>
                      <li><strong>Harici Devre:</strong> Elektronların anottan katoda akması için yol.</li>
                    </ul>
                    
                    <h4>Çalışma Prensipleri</h4>
                    <ol>
                      <li>Bir pil bir devreye bağlandığında, anottaki bir kimyasal tepkime elektronları serbest bırakır.</li>
                      <li>Bu elektronlar elektrik enerjisi sağlayarak harici devreden akar.</li>
                      <li>Elektronlar bir redüksiyon tepkimesinde katotta tüketilir.</li>
                      <li>İyonlar, elektriksel nötrlüğü korumak için elektrolitten akar.</li>
                      <li>Bu elektron akışı elektrik akımı oluşturur.</li>
                    </ol>
                    
                    <h4>Birincil ve İkincil Piller</h4>
                    <ul>
                      <li><strong>Birincil Piller:</strong> Şarj edilemeyen, tek kullanımlık (örneğin, çinko-karbon, alkalin)</li>
                      <li><strong>İkincil Piller:</strong> Şarj edilebilen, kimyasal tepkimeler tersine çevrilebilir (örneğin, lityum iyon, kurşun asit)</li>
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