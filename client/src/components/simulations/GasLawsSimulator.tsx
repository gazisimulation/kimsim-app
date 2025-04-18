import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Thermometer, Maximize2, Weight, FlaskConical, ArrowDownUp, GripHorizontal } from 'lucide-react';

// Gaz sabitleri
const R = 0.08206; // L·atm/mol·K
const BOLTZMANN = 1.380649e-23; // J/K
const AVOGADRO = 6.02214076e23; // 1/mol

// Gaz özellikleri
const GASES = {
  'Oksijen': {
    molarMass: 32.0, // g/mol
    color: '#74c0fc',
    vanDerWaalsA: 1.382, // L²·atm/mol²
    vanDerWaalsB: 0.03186, // L/mol
    criticalTemperature: 154.6, // K
    criticalPressure: 50.43, // atm
  },
  'Azot': {
    molarMass: 28.01, // g/mol
    color: '#74c0fc',
    vanDerWaalsA: 1.370, // L²·atm/mol²
    vanDerWaalsB: 0.0387, // L/mol
    criticalTemperature: 126.2, // K
    criticalPressure: 33.5, // atm
  },
  'Karbon Dioksit': {
    molarMass: 44.01, // g/mol
    color: '#ff6b6b',
    vanDerWaalsA: 3.658, // L²·atm/mol²
    vanDerWaalsB: 0.04267, // L/mol
    criticalTemperature: 304.2, // K
    criticalPressure: 72.8, // atm
  },
  'Helyum': {
    molarMass: 4.0026, // g/mol
    color: '#9775fa',
    vanDerWaalsA: 0.034, // L²·atm/mol²
    vanDerWaalsB: 0.0237, // L/mol
    criticalTemperature: 5.2, // K
    criticalPressure: 2.27, // atm
  },
  'Metan': {
    molarMass: 16.04, // g/mol
    color: '#63e6be',
    vanDerWaalsA: 2.283, // L²·atm/mol²
    vanDerWaalsB: 0.04278, // L/mol
    criticalTemperature: 190.6, // K
    criticalPressure: 45.8, // atm
  }
};

type GasName = keyof typeof GASES;
type GasLaw = 'ideal' | 'vanderwaals';
type ChartType = 'pressure-volume' | 'pressure-temperature' | 'volume-temperature' | 'molecular-speed';

export default function GasLawsSimulator() {
  // Gaz parametreleri
  const [activeTab, setActiveTab] = useState<string>('ideal-gas-law');
  const [gasName, setGasName] = useState<GasName>('Oksijen');
  const [moles, setMoles] = useState<number>(1);
  const [temperature, setTemperature] = useState<number>(300); // K
  const [pressure, setPressure] = useState<number>(1); // atm
  const [volume, setVolume] = useState<number>(24.4); // L
  const [gasLaw, setGasLaw] = useState<GasLaw>('ideal');
  const [chartType, setChartType] = useState<ChartType>('pressure-volume');
  
  // Karışım sekmesi için
  const [gas1Name, setGas1Name] = useState<GasName>('Oksijen');
  const [gas2Name, setGas2Name] = useState<GasName>('Azot');
  const [gas1Fraction, setGas1Fraction] = useState<number>(0.5);
  
  // Kinetik teori sekmesi için
  const [showHist, setShowHist] = useState<boolean>(true);
  
  // Refs for canvas rendering
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<HTMLCanvasElement>(null);
  const histogramRef = useRef<HTMLCanvasElement>(null);
  
  // Animation frame ref
  const animationFrameRef = useRef<number | null>(null);
  
  // Calculate volume based on ideal gas law
  useEffect(() => {
    if (activeTab === 'ideal-gas-law') {
      // PV = nRT -> V = nRT/P
      const newVolume = calculateVolume(moles, temperature, pressure, gasLaw, gasName);
      setVolume(parseFloat(newVolume.toFixed(2)));
    }
  }, [moles, temperature, pressure, gasLaw, gasName, activeTab]);
  
  // Calculate pressure based on ideal gas law for kinetic theory
  useEffect(() => {
    if (activeTab === 'kinetic-theory') {
      // PV = nRT -> P = nRT/V
      const newPressure = calculatePressure(moles, temperature, volume, gasLaw, gasName);
      setPressure(parseFloat(newPressure.toFixed(2)));
    }
  }, [moles, temperature, volume, gasLaw, gasName, activeTab]);
  
  // Draw gas particles animation when on kinetic theory tab
  useEffect(() => {
    if (activeTab === 'kinetic-theory') {
      // Start the animation
      startParticleSimulation();
      return () => {
        // Clean up animation on unmount
        if (animationFrameRef.current !== null) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [activeTab, moles, temperature, gasName]);
  
  // Draw charts when on ideal-gas-law or real-gases tab
  useEffect(() => {
    if (activeTab === 'ideal-gas-law' || activeTab === 'real-gases') {
      drawChart();
    }
  }, [activeTab, chartType, gasLaw, gasName, moles, temperature, pressure]);
  
  // Draw mixture visualization when on gas-mixtures tab
  useEffect(() => {
    if (activeTab === 'gas-mixtures') {
      drawMixture();
    }
  }, [activeTab, gas1Name, gas2Name, gas1Fraction, temperature, pressure]);
  
  // Calculate new volume based on gas law
  function calculateVolume(n: number, T: number, P: number, law: GasLaw, gas: GasName): number {
    if (law === 'ideal') {
      return (n * R * T) / P;
    } else {
      // Van der Waals: (P + a(n/V)²)(V - nb) = nRT
      // This is a cubic equation that requires numerical solving, but we'll approximate
      const a = GASES[gas].vanDerWaalsA;
      const b = GASES[gas].vanDerWaalsB;
      
      // Start with ideal gas approximation
      let V = (n * R * T) / P;
      
      // Iterative improvement (simplified)
      for (let i = 0; i < 5; i++) {
        V = (n * R * T) / (P + a * Math.pow(n / V, 2)) + n * b;
      }
      
      return V > 0 ? V : 0.1; // Prevent negative volumes
    }
  }
  
  // Calculate pressure based on gas law
  function calculatePressure(n: number, T: number, V: number, law: GasLaw, gas: GasName): number {
    if (law === 'ideal') {
      return (n * R * T) / V;
    } else {
      // Van der Waals: P = nRT/(V - nb) - a(n/V)²
      const a = GASES[gas].vanDerWaalsA;
      const b = GASES[gas].vanDerWaalsB;
      
      const pressure = (n * R * T) / (V - n * b) - a * Math.pow(n / V, 2);
      return pressure > 0 ? pressure : 0.1; // Prevent negative pressure
    }
  }
  
  // Calculate the most probable speed of a gas molecule at given temperature
  function calculateMolecularSpeed(T: number, molarMass: number): number {
    // Using the Maxwell-Boltzmann distribution
    // Most probable speed = sqrt(2RT/M) where M is in kg/mol
    const massInKg = molarMass / 1000; // Convert g/mol to kg/mol
    return Math.sqrt(2 * 8.314 * T / massInKg); // in m/s
  }
  
  // Draw a chart based on the selected chart type
  function drawChart() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set up chart dimensions
    const chartWidth = canvas.width - 60;
    const chartHeight = canvas.height - 60;
    const chartX = 50;
    const chartY = 10;
    
    // Draw axes
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(chartX, chartY + chartHeight);
    ctx.lineTo(chartX + chartWidth, chartY + chartHeight); // x-axis
    ctx.moveTo(chartX, chartY);
    ctx.lineTo(chartX, chartY + chartHeight); // y-axis
    ctx.stroke();
    
    // Draw axes labels
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    
    // Switch based on chart type
    switch (chartType) {
      case 'pressure-volume':
        drawPVChart(ctx, chartX, chartY, chartWidth, chartHeight);
        break;
      case 'pressure-temperature':
        drawPTChart(ctx, chartX, chartY, chartWidth, chartHeight);
        break;
      case 'volume-temperature':
        drawVTChart(ctx, chartX, chartY, chartWidth, chartHeight);
        break;
      case 'molecular-speed':
        drawMolecularSpeedChart(ctx, chartX, chartY, chartWidth, chartHeight);
        break;
    }
  }
  
  // Draw pressure-volume chart
  function drawPVChart(ctx: CanvasRenderingContext2D, chartX: number, chartY: number, chartWidth: number, chartHeight: number) {
    const T = temperature; // K
    const n = moles; // mol
    
    // Labels
    ctx.fillText('Volume (L)', chartX + chartWidth / 2 - 30, chartY + chartHeight + 30);
    ctx.save();
    ctx.translate(chartX - 35, chartY + chartHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Pressure (atm)', 0, 0);
    ctx.restore();
    
    // Draw isotherms for current gas
    const maxVolume = 40; // L
    const maxPressure = 10; // atm
    
    // Draw grid lines
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 0.5;
    
    // Volume grid lines
    for (let v = 0; v <= maxVolume; v += 5) {
      const x = chartX + (v / maxVolume) * chartWidth;
      ctx.beginPath();
      ctx.moveTo(x, chartY);
      ctx.lineTo(x, chartY + chartHeight);
      ctx.stroke();
      ctx.fillText(v.toString(), x - 5, chartY + chartHeight + 15);
    }
    
    // Pressure grid lines
    for (let p = 0; p <= maxPressure; p += 1) {
      const y = chartY + chartHeight - (p / maxPressure) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(chartX, y);
      ctx.lineTo(chartX + chartWidth, y);
      ctx.stroke();
      ctx.fillText(p.toString(), chartX - 25, y + 5);
    }
    
    // Draw ideal gas curve
    ctx.strokeStyle = '#1a73e8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let v = 0.5; v <= maxVolume; v += 0.1) {
      const p = (n * R * T) / v;
      if (p > maxPressure) continue;
      
      const x = chartX + (v / maxVolume) * chartWidth;
      const y = chartY + chartHeight - (p / maxPressure) * chartHeight;
      
      if (v === 0.5) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
    
    // Draw Van der Waals curve if selected
    if (gasLaw === 'vanderwaals') {
      const a = GASES[gasName].vanDerWaalsA;
      const b = GASES[gasName].vanDerWaalsB;
      
      ctx.strokeStyle = '#e67700';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      for (let v = 0.5; v <= maxVolume; v += 0.1) {
        // Van der Waals equation: P = nRT/(V-nb) - a(n/V)²
        const p = (n * R * T) / (v - n * b) - a * Math.pow(n / v, 2);
        if (p > maxPressure || p < 0) continue;
        
        const x = chartX + (v / maxVolume) * chartWidth;
        const y = chartY + chartHeight - (p / maxPressure) * chartHeight;
        
        if (v === 0.5) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      
      // Add legend
      ctx.fillStyle = '#1a73e8';
      ctx.fillRect(chartX + chartWidth - 150, chartY + 10, 15, 15);
      ctx.fillStyle = '#333';
      ctx.fillText('Ideal Gas Law', chartX + chartWidth - 130, chartY + 22);
      
      ctx.fillStyle = '#e67700';
      ctx.fillRect(chartX + chartWidth - 150, chartY + 35, 15, 15);
      ctx.fillStyle = '#333';
      ctx.fillText('Van der Waals', chartX + chartWidth - 130, chartY + 47);
    }
    
    // Mark current state
    ctx.fillStyle = '#f03e3e';
    const currentX = chartX + (volume / maxVolume) * chartWidth;
    const currentY = chartY + chartHeight - (pressure / maxPressure) * chartHeight;
    
    if (currentX > chartX && currentX < chartX + chartWidth && 
        currentY > chartY && currentY < chartY + chartHeight) {
      ctx.beginPath();
      ctx.arc(currentX, currentY, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  // Draw pressure-temperature chart
  function drawPTChart(ctx: CanvasRenderingContext2D, chartX: number, chartY: number, chartWidth: number, chartHeight: number) {
    const V = volume; // L
    const n = moles; // mol
    
    // Labels
    ctx.fillText('Temperature (K)', chartX + chartWidth / 2 - 40, chartY + chartHeight + 30);
    ctx.save();
    ctx.translate(chartX - 35, chartY + chartHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Pressure (atm)', 0, 0);
    ctx.restore();
    
    // Draw isobaric lines
    const maxTemperature = 500; // K
    const maxPressure = 10; // atm
    
    // Draw grid lines
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 0.5;
    
    // Temperature grid lines
    for (let t = 0; t <= maxTemperature; t += 50) {
      const x = chartX + (t / maxTemperature) * chartWidth;
      ctx.beginPath();
      ctx.moveTo(x, chartY);
      ctx.lineTo(x, chartY + chartHeight);
      ctx.stroke();
      ctx.fillText(t.toString(), x - 10, chartY + chartHeight + 15);
    }
    
    // Pressure grid lines
    for (let p = 0; p <= maxPressure; p += 1) {
      const y = chartY + chartHeight - (p / maxPressure) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(chartX, y);
      ctx.lineTo(chartX + chartWidth, y);
      ctx.stroke();
      ctx.fillText(p.toString(), chartX - 25, y + 5);
    }
    
    // Draw ideal gas line
    ctx.strokeStyle = '#1a73e8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let t = 50; t <= maxTemperature; t += 5) {
      const p = (n * R * t) / V;
      if (p > maxPressure) continue;
      
      const x = chartX + (t / maxTemperature) * chartWidth;
      const y = chartY + chartHeight - (p / maxPressure) * chartHeight;
      
      if (t === 50) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
    
    // Draw Van der Waals curve if selected
    if (gasLaw === 'vanderwaals') {
      const a = GASES[gasName].vanDerWaalsA;
      const b = GASES[gasName].vanDerWaalsB;
      
      ctx.strokeStyle = '#e67700';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      for (let t = 50; t <= maxTemperature; t += 5) {
        // Van der Waals equation: P = nRT/(V-nb) - a(n/V)²
        const p = (n * R * t) / (V - n * b) - a * Math.pow(n / V, 2);
        if (p > maxPressure || p < 0) continue;
        
        const x = chartX + (t / maxTemperature) * chartWidth;
        const y = chartY + chartHeight - (p / maxPressure) * chartHeight;
        
        if (t === 50) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      
      // Add legend
      ctx.fillStyle = '#1a73e8';
      ctx.fillRect(chartX + chartWidth - 150, chartY + 10, 15, 15);
      ctx.fillStyle = '#333';
      ctx.fillText('Ideal Gas Law', chartX + chartWidth - 130, chartY + 22);
      
      ctx.fillStyle = '#e67700';
      ctx.fillRect(chartX + chartWidth - 150, chartY + 35, 15, 15);
      ctx.fillStyle = '#333';
      ctx.fillText('Van der Waals', chartX + chartWidth - 130, chartY + 47);
    }
    
    // Mark current state
    ctx.fillStyle = '#f03e3e';
    const currentX = chartX + (temperature / maxTemperature) * chartWidth;
    const currentY = chartY + chartHeight - (pressure / maxPressure) * chartHeight;
    
    if (currentX > chartX && currentX < chartX + chartWidth && 
        currentY > chartY && currentY < chartY + chartHeight) {
      ctx.beginPath();
      ctx.arc(currentX, currentY, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  // Draw volume-temperature chart
  function drawVTChart(ctx: CanvasRenderingContext2D, chartX: number, chartY: number, chartWidth: number, chartHeight: number) {
    const P = pressure; // atm
    const n = moles; // mol
    
    // Labels
    ctx.fillText('Temperature (K)', chartX + chartWidth / 2 - 40, chartY + chartHeight + 30);
    ctx.save();
    ctx.translate(chartX - 35, chartY + chartHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Volume (L)', 0, 0);
    ctx.restore();
    
    // Draw isotherms
    const maxTemperature = 500; // K
    const maxVolume = 40; // L
    
    // Draw grid lines
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 0.5;
    
    // Temperature grid lines
    for (let t = 0; t <= maxTemperature; t += 50) {
      const x = chartX + (t / maxTemperature) * chartWidth;
      ctx.beginPath();
      ctx.moveTo(x, chartY);
      ctx.lineTo(x, chartY + chartHeight);
      ctx.stroke();
      ctx.fillText(t.toString(), x - 10, chartY + chartHeight + 15);
    }
    
    // Volume grid lines
    for (let v = 0; v <= maxVolume; v += 5) {
      const y = chartY + chartHeight - (v / maxVolume) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(chartX, y);
      ctx.lineTo(chartX + chartWidth, y);
      ctx.stroke();
      ctx.fillText(v.toString(), chartX - 25, y + 5);
    }
    
    // Draw ideal gas line
    ctx.strokeStyle = '#1a73e8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let t = 50; t <= maxTemperature; t += 5) {
      const v = (n * R * t) / P;
      if (v > maxVolume) continue;
      
      const x = chartX + (t / maxTemperature) * chartWidth;
      const y = chartY + chartHeight - (v / maxVolume) * chartHeight;
      
      if (t === 50) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
    
    // Draw Van der Waals curve if selected
    if (gasLaw === 'vanderwaals') {
      const a = GASES[gasName].vanDerWaalsA;
      const b = GASES[gasName].vanDerWaalsB;
      
      ctx.strokeStyle = '#e67700';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      let firstPoint = true;
      
      for (let t = 50; t <= maxTemperature; t += 5) {
        // Calculate volume using van der Waals
        const v = calculateVolume(n, t, P, 'vanderwaals', gasName);
        if (v > maxVolume || v < 0) continue;
        
        const x = chartX + (t / maxTemperature) * chartWidth;
        const y = chartY + chartHeight - (v / maxVolume) * chartHeight;
        
        if (firstPoint) {
          ctx.moveTo(x, y);
          firstPoint = false;
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      
      // Add legend
      ctx.fillStyle = '#1a73e8';
      ctx.fillRect(chartX + chartWidth - 150, chartY + 10, 15, 15);
      ctx.fillStyle = '#333';
      ctx.fillText('Ideal Gas Law', chartX + chartWidth - 130, chartY + 22);
      
      ctx.fillStyle = '#e67700';
      ctx.fillRect(chartX + chartWidth - 150, chartY + 35, 15, 15);
      ctx.fillStyle = '#333';
      ctx.fillText('Van der Waals', chartX + chartWidth - 130, chartY + 47);
    }
    
    // Mark current state
    ctx.fillStyle = '#f03e3e';
    const currentX = chartX + (temperature / maxTemperature) * chartWidth;
    const currentY = chartY + chartHeight - (volume / maxVolume) * chartHeight;
    
    if (currentX > chartX && currentX < chartX + chartWidth && 
        currentY > chartY && currentY < chartY + chartHeight) {
      ctx.beginPath();
      ctx.arc(currentX, currentY, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  // Draw molecular speed distribution chart
  function drawMolecularSpeedChart(ctx: CanvasRenderingContext2D, chartX: number, chartY: number, chartWidth: number, chartHeight: number) {
    const T = temperature; // K
    const molarMass = GASES[gasName].molarMass; // g/mol
    
    // Labels
    ctx.fillText('Moleküler Hız (m/s)', chartX + chartWidth / 2 - 50, chartY + chartHeight + 30);
    ctx.save();
    ctx.translate(chartX - 35, chartY + chartHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Olasılık Yoğunluğu', 0, 0);
    ctx.restore();
    
    // Calculate Maxwell-Boltzmann distribution parameters
    const massInKg = molarMass / 1000; // Convert g/mol to kg/mol
    const gasConstant = 8.314; // J/(mol·K)
    
    // Most probable speed (peak of the distribution)
    const vmp = Math.sqrt(2 * gasConstant * T / massInKg);
    
    // Average speed
    const vavg = Math.sqrt(8 * gasConstant * T / (Math.PI * massInKg));
    
    // Root mean square speed
    const vrms = Math.sqrt(3 * gasConstant * T / massInKg);
    
    // Maximum speed to display (3x the most probable speed)
    const maxSpeed = Math.max(3000, Math.ceil(vrms * 2));
    
    // Draw grid lines
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 0.5;
    
    // Speed grid lines
    for (let s = 0; s <= maxSpeed; s += 500) {
      const x = chartX + (s / maxSpeed) * chartWidth;
      ctx.beginPath();
      ctx.moveTo(x, chartY);
      ctx.lineTo(x, chartY + chartHeight);
      ctx.stroke();
      ctx.fillText(s.toString(), x - 15, chartY + chartHeight + 15);
    }
    
    // Maxwell-Boltzmann probability density function
    function maxwellBoltzmannPDF(v: number, m: number, T: number): number {
      // f(v) = (m/(2πkT))^(3/2) * 4πv² * exp(-mv²/(2kT))
      const k = BOLTZMANN; // Boltzmann constant
      const term1 = Math.pow(m / (2 * Math.PI * k * T), 1.5);
      const term2 = 4 * Math.PI * v * v;
      const term3 = Math.exp(-m * v * v / (2 * k * T));
      return term1 * term2 * term3;
    }
    
    // Draw the Maxwell-Boltzmann distribution
    ctx.strokeStyle = '#1a73e8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    // Find maximum value for normalization
    let maxPDF = 0;
    for (let v = 0; v <= maxSpeed; v += 10) {
      const m = massInKg / AVOGADRO; // Mass of one molecule in kg
      const pdf = maxwellBoltzmannPDF(v, m, T);
      if (pdf > maxPDF) maxPDF = pdf;
    }
    
    for (let v = 0; v <= maxSpeed; v += 10) {
      const m = massInKg / AVOGADRO; // Mass of one molecule in kg
      const pdf = maxwellBoltzmannPDF(v, m, T);
      const normalizedPDF = pdf / maxPDF; // Normalize to fit chart height
      
      const x = chartX + (v / maxSpeed) * chartWidth;
      const y = chartY + chartHeight - normalizedPDF * chartHeight;
      
      if (v === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
    
    // Mark characteristic speeds
    // Most probable speed (vmp)
    ctx.strokeStyle = '#1098ad';
    ctx.lineWidth = 1;
    ctx.beginPath();
    const vmpX = chartX + (vmp / maxSpeed) * chartWidth;
    ctx.moveTo(vmpX, chartY + chartHeight);
    ctx.lineTo(vmpX, chartY);
    ctx.stroke();
    ctx.fillStyle = '#1098ad';
    ctx.fillText('vmp', vmpX + 5, chartY + 20);
    
    // Average speed (vavg)
    ctx.strokeStyle = '#d6336c';
    ctx.beginPath();
    const vavgX = chartX + (vavg / maxSpeed) * chartWidth;
    ctx.moveTo(vavgX, chartY + chartHeight);
    ctx.lineTo(vavgX, chartY);
    ctx.stroke();
    ctx.fillStyle = '#d6336c';
    ctx.fillText('vavg', vavgX + 5, chartY + 40);
    
    // Root mean square speed (vrms)
    ctx.strokeStyle = '#f76707';
    ctx.beginPath();
    const vrmsX = chartX + (vrms / maxSpeed) * chartWidth;
    ctx.moveTo(vrmsX, chartY + chartHeight);
    ctx.lineTo(vrmsX, chartY);
    ctx.stroke();
    ctx.fillStyle = '#f76707';
    ctx.fillText('vrms', vrmsX + 5, chartY + 60);
    
    // Add legend for values
    ctx.fillStyle = '#333';
    ctx.fillText(`En olası hız (vmp): ${vmp.toFixed(0)} m/s`, chartX + 10, chartY + chartHeight - 60);
    ctx.fillText(`Ortalama hız (vavg): ${vavg.toFixed(0)} m/s`, chartX + 10, chartY + chartHeight - 40);
    ctx.fillText(`Kareli ortalama kök hızı (vrms): ${vrms.toFixed(0)} m/s`, chartX + 10, chartY + chartHeight - 20);
  }
  
  // Draw gas mixture visualization
  function drawMixture() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Get gas properties
    const gas1 = GASES[gas1Name];
    const gas2 = GASES[gas2Name];
    
    // Calculate total pressure and partial pressures
    const totalPressure = pressure; // atm
    const gas1PartialPressure = totalPressure * gas1Fraction;
    const gas2PartialPressure = totalPressure * (1 - gas1Fraction);
    
    // Draw container
    const containerWidth = canvas.width - 100;
    const containerHeight = canvas.height - 60;
    const containerX = 50;
    const containerY = 30;
    
    // Draw container outline
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.strokeRect(containerX, containerY, containerWidth, containerHeight);
    
    // Draw particles
    const particleCount = 200; // Total number of particles to draw
    const gas1Count = Math.round(particleCount * gas1Fraction);
    const gas2Count = particleCount - gas1Count;
    
    // Adjust particle size based on temperature
    const baseParticleSize = 4;
    const particleSize = baseParticleSize * (1 + (temperature - 300) / 1000);
    
    // Function to draw a gas particle with color
    function drawParticle(x: number, y: number, color: string, size: number) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Draw gas 1 particles
    ctx.fillStyle = gas1.color;
    for (let i = 0; i < gas1Count; i++) {
      const x = containerX + Math.random() * containerWidth;
      const y = containerY + Math.random() * containerHeight;
      drawParticle(x, y, gas1.color, particleSize);
    }
    
    // Draw gas 2 particles
    ctx.fillStyle = gas2.color;
    for (let i = 0; i < gas2Count; i++) {
      const x = containerX + Math.random() * containerWidth;
      const y = containerY + Math.random() * containerHeight;
      drawParticle(x, y, gas2.color, particleSize);
    }
    
    // Add legend
    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    
    ctx.fillText('Gaz Karışımı', containerX, containerY - 10);
    
    // Gas 1 info
    ctx.fillStyle = gas1.color;
    ctx.fillRect(containerX, containerY + containerHeight + 15, 15, 15);
    ctx.fillStyle = '#333';
    ctx.fillText(`${gas1Name}: ${(gas1Fraction * 100).toFixed(0)}%`, containerX + 25, containerY + containerHeight + 27);
    ctx.fillText(`Kısmi Basınç: ${gas1PartialPressure.toFixed(2)} atm`, containerX + 25, containerY + containerHeight + 47);
    
    // Gas 2 info
    ctx.fillStyle = gas2.color;
    ctx.fillRect(containerX + 200, containerY + containerHeight + 15, 15, 15);
    ctx.fillStyle = '#333';
    ctx.fillText(`${gas2Name}: ${((1 - gas1Fraction) * 100).toFixed(0)}%`, containerX + 225, containerY + containerHeight + 27);
    ctx.fillText(`Kısmi Basınç: ${gas2PartialPressure.toFixed(2)} atm`, containerX + 225, containerY + containerHeight + 47);
    
    // Total info
    ctx.fillText(`Sıcaklık: ${temperature} K`, containerX + 430, containerY + containerHeight + 27);
    ctx.fillText(`Toplam Basınç: ${totalPressure.toFixed(2)} atm`, containerX + 430, containerY + containerHeight + 47);
  }
  
  // Dynamic particle simulation for kinetic theory visualization
  interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    mass: number;
    color: string;
  }
  
  const particles: Particle[] = [];
  
  function initParticles() {
    // Clear existing particles
    particles.length = 0;
    
    const canvas = particlesRef.current;
    if (!canvas) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Number of particles based on moles (scaled for visualization)
    const numParticles = Math.min(Math.round(moles * 50), 200);
    
    // Particle speed based on temperature
    const baseSpeed = Math.sqrt(temperature / 300);
    const gas = GASES[gasName];
    
    // Create particles
    for (let i = 0; i < numParticles; i++) {
      const radius = 5; // Base radius
      const x = radius + Math.random() * (width - 2 * radius);
      const y = radius + Math.random() * (height - 2 * radius);
      
      // Random velocity with magnitude based on temperature
      const angle = Math.random() * 2 * Math.PI;
      const speed = baseSpeed * (0.5 + Math.random());
      const vx = speed * Math.cos(angle);
      const vy = speed * Math.sin(angle);
      
      particles.push({
        x,
        y,
        vx,
        vy,
        radius,
        mass: gas.molarMass / numParticles,
        color: gas.color
      });
    }
  }
  
  function updateParticles() {
    const canvas = particlesRef.current;
    if (!canvas) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw container
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, width, height);
    
    // Calculate speeds for histogram
    const speeds: number[] = [];
    
    // Update particle positions and handle collisions
    for (const particle of particles) {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Boundary collisions (elastic)
      if (particle.x - particle.radius < 0) {
        particle.x = particle.radius;
        particle.vx = -particle.vx;
      } else if (particle.x + particle.radius > width) {
        particle.x = width - particle.radius;
        particle.vx = -particle.vx;
      }
      
      if (particle.y - particle.radius < 0) {
        particle.y = particle.radius;
        particle.vy = -particle.vy;
      } else if (particle.y + particle.radius > height) {
        particle.y = height - particle.radius;
        particle.vy = -particle.vy;
      }
      
      // Calculate speed for histogram
      const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
      speeds.push(speed);
      
      // Draw particle
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Draw speed histogram if enabled
    if (showHist) {
      drawSpeedHistogram(speeds);
    }
    
    // Request next frame
    animationFrameRef.current = requestAnimationFrame(updateParticles);
  }
  
  function drawSpeedHistogram(speeds: number[]) {
    const canvas = histogramRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set up histogram dimensions
    const histWidth = canvas.width - 20;
    const histHeight = canvas.height - 30;
    const histX = 10;
    const histY = 10;
    
    // Draw axes
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(histX, histY + histHeight);
    ctx.lineTo(histX + histWidth, histY + histHeight); // x-axis
    ctx.moveTo(histX, histY);
    ctx.lineTo(histX, histY + histHeight); // y-axis
    ctx.stroke();
    
    // Create bins for histogram
    const maxSpeed = Math.max(...speeds) * 1.1;
    const numBins = 20;
    const bins = Array(numBins).fill(0);
    
    // Count particles in each bin
    for (const speed of speeds) {
      const binIndex = Math.min(Math.floor((speed / maxSpeed) * numBins), numBins - 1);
      bins[binIndex]++;
    }
    
    // Find maximum bin count for normalization
    const maxBinCount = Math.max(...bins);
    
    // Draw histogram bars
    const binWidth = histWidth / numBins;
    
    ctx.fillStyle = 'rgba(26, 115, 232, 0.7)';
    for (let i = 0; i < numBins; i++) {
      const normalizedHeight = bins[i] / maxBinCount * histHeight;
      const x = histX + i * binWidth;
      const y = histY + histHeight - normalizedHeight;
      
      ctx.fillRect(x, y, binWidth - 1, normalizedHeight);
    }
    
    // Draw x-axis labels
    ctx.fillStyle = '#333';
    ctx.font = '10px Arial';
    ctx.fillText('0', histX, histY + histHeight + 12);
    ctx.fillText(maxSpeed.toFixed(1), histX + histWidth - 20, histY + histHeight + 12);
    ctx.fillText('Hız Dağılımı', histX + histWidth / 2 - 40, histY + histHeight + 20);
  }
  
  function startParticleSimulation() {
    initParticles();
    
    // Stop any ongoing animation
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    // Start animation
    animationFrameRef.current = requestAnimationFrame(updateParticles);
  }
  
  return (
    <div className="flex flex-col gap-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="ideal-gas-law" className="flex items-center gap-2">
            <FlaskConical className="h-4 w-4" /> İdeal Gaz Yasası
          </TabsTrigger>
          <TabsTrigger value="kinetic-theory" className="flex items-center gap-2">
            <GripHorizontal className="h-4 w-4" /> Kinetik Teori
          </TabsTrigger>
          <TabsTrigger value="gas-mixtures" className="flex items-center gap-2">
            <ArrowDownUp className="h-4 w-4" /> Gaz Karışımları
          </TabsTrigger>
          <TabsTrigger value="real-gases" className="flex items-center gap-2">
            <Maximize2 className="h-4 w-4" /> Gerçek Gazlar
          </TabsTrigger>
        </TabsList>
      
        <TabsContent value="ideal-gas-law" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-6">
            <Card className="w-full md:w-1/3">
              <CardHeader>
                <CardTitle>Gaz Parametreleri</CardTitle>
                <CardDescription>Değişiklikleri gözlemlemek için parametreleri ayarlayın</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="gas-type">Gas Type</Label>
                  <Select value={gasName} onValueChange={(value: GasName) => setGasName(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gas" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(GASES).map((gas) => (
                        <SelectItem key={gas} value={gas}>{gas}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gas-law">Gas Law Model</Label>
                  <Select value={gasLaw} onValueChange={(value: GasLaw) => setGasLaw(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ideal">Ideal Gas Law</SelectItem>
                      <SelectItem value="vanderwaals">Van der Waals Equation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Moles (n)</Label>
                  <div className="flex items-center gap-2">
                    <Slider 
                      min={0.1} 
                      max={5} 
                      step={0.1} 
                      value={[moles]} 
                      onValueChange={(values) => setMoles(values[0])} 
                    />
                    <span className="w-10 text-right">{moles}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Temperature (K)</Label>
                  <div className="flex items-center gap-2">
                    <Slider 
                      min={100} 
                      max={1000} 
                      step={10} 
                      value={[temperature]} 
                      onValueChange={(values) => setTemperature(values[0])} 
                    />
                    <span className="w-10 text-right">{temperature}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Pressure (atm)</Label>
                  <div className="flex items-center gap-2">
                    <Slider 
                      min={0.1} 
                      max={10} 
                      step={0.1} 
                      value={[pressure]} 
                      onValueChange={(values) => setPressure(values[0])} 
                    />
                    <span className="w-10 text-right">{pressure}</span>
                  </div>
                </div>

                <div className="pt-4">
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                    <h3 className="font-medium mb-2">Current Values</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Gas:</div><div className="font-medium">{gasName}</div>
                      <div>Moles (n):</div><div className="font-medium">{moles} mol</div>
                      <div>Temperature (T):</div><div className="font-medium">{temperature} K</div>
                      <div>Pressure (P):</div><div className="font-medium">{pressure} atm</div>
                      <div>Volume (V):</div><div className="font-medium">{volume.toFixed(2)} L</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="w-full md:w-2/3">
              <CardHeader>
                <CardTitle>Gaz Yasası Görselleştirmesi</CardTitle>
                <CardDescription>Gaz davranışının interaktif grafikleri</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant={chartType === 'pressure-volume' ? "default" : "outline"}
                    onClick={() => setChartType('pressure-volume')}
                    className="text-xs"
                  >
                    Basınç-Hacim
                  </Button>
                  <Button 
                    variant={chartType === 'pressure-temperature' ? "default" : "outline"}
                    onClick={() => setChartType('pressure-temperature')}
                    className="text-xs"
                  >
                    Basınç-Sıcaklık
                  </Button>
                  <Button 
                    variant={chartType === 'volume-temperature' ? "default" : "outline"}
                    onClick={() => setChartType('volume-temperature')}
                    className="text-xs"
                  >
                    Hacim-Sıcaklık
                  </Button>
                  <Button 
                    variant={chartType === 'molecular-speed' ? "default" : "outline"}
                    onClick={() => setChartType('molecular-speed')}
                    className="text-xs"
                  >
                    Moleküler Hız Dağılımı
                  </Button>
                </div>
                
                <div className="h-[400px] w-full bg-gray-50 dark:bg-gray-900 rounded-md relative">
                  <canvas 
                    ref={canvasRef} 
                    className="w-full h-full"
                    width={800}
                    height={400}
                  />
                </div>

                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                  <h3 className="font-medium mb-2">Denklem Referansı</h3>
                  <p>İdeal Gaz Yasası: PV = nRT, burada R = {R} L·atm/mol·K</p>
                  {gasLaw === 'vanderwaals' && (
                    <p className="mt-2">
                      Van der Waals Denklemi: (P + a(n/V)²)(V - nb) = nRT
                      <br />
                      {gasName} için: a = {GASES[gasName].vanDerWaalsA} L²·atm/mol², b = {GASES[gasName].vanDerWaalsB} L/mol
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="kinetic-theory" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-6">
            <Card className="w-full md:w-1/3">
              <CardHeader>
                <CardTitle>Kinetik Teori</CardTitle>
                <CardDescription>Moleküler davranışı keşfedin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="gas-type">Gas Type</Label>
                  <Select value={gasName} onValueChange={(value: GasName) => setGasName(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gas" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(GASES).map((gas) => (
                        <SelectItem key={gas} value={gas}>{gas}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Moles (n)</Label>
                  <div className="flex items-center gap-2">
                    <Slider 
                      min={0.1} 
                      max={5} 
                      step={0.1} 
                      value={[moles]} 
                      onValueChange={(values) => setMoles(values[0])} 
                    />
                    <span className="w-10 text-right">{moles}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Temperature (K)</Label>
                  <div className="flex items-center gap-2">
                    <Slider 
                      min={100} 
                      max={1000} 
                      step={10} 
                      value={[temperature]} 
                      onValueChange={(values) => setTemperature(values[0])} 
                    />
                    <span className="w-10 text-right">{temperature}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Volume (L)</Label>
                  <div className="flex items-center gap-2">
                    <Slider 
                      min={1} 
                      max={50} 
                      step={1} 
                      value={[volume]} 
                      onValueChange={(values) => setVolume(values[0])} 
                    />
                    <span className="w-10 text-right">{volume}</span>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Label>Hız Dağılımını Göster</Label>
                  <Button
                    variant={showHist ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowHist(!showHist)}
                  >
                    {showHist ? "Gizle" : "Göster"}
                  </Button>
                </div>

                <div className="pt-4">
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                    <h3 className="font-medium mb-2">Kinetik Özellikler</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Gaz:</div><div className="font-medium">{gasName}</div>
                      <div>Molar kütle:</div><div className="font-medium">{GASES[gasName].molarMass} g/mol</div>
                      <div>Sıcaklık:</div><div className="font-medium">{temperature} K</div>
                      <div>Basınç:</div><div className="font-medium">{pressure.toFixed(2)} atm</div>
                      <div>Ortalama KE:</div><div className="font-medium">{((3/2) * BOLTZMANN * temperature * AVOGADRO / 1000).toFixed(2)} J/mol</div>
                      <div>En olası hız:</div><div className="font-medium">{calculateMolecularSpeed(temperature, GASES[gasName].molarMass).toFixed(0)} m/s</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="w-full md:w-2/3">
              <CardHeader>
                <CardTitle>Moleküler Hareket Simülasyonu</CardTitle>
                <CardDescription>Gaz moleküllerinin nasıl hareket ettiğini ve etkileştiğini görün</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="h-64 bg-gray-100 dark:bg-gray-900 rounded-md">
                    <canvas 
                      ref={particlesRef} 
                      className="w-full h-full rounded-md"
                      width={600}
                      height={240}
                    />
                  </div>
                  
                  {showHist && (
                    <div className="h-32 bg-gray-100 dark:bg-gray-900 rounded-md">
                      <canvas 
                        ref={histogramRef} 
                        className="w-full h-full rounded-md"
                        width={600}
                        height={120}
                      />
                    </div>
                  )}
                  
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-sm">
                    <h3 className="font-medium mb-1">Kinetik Teori Anahtar Noktaları:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Gaz parçacıkları sürekli rastgele hareket halindedir</li>
                      <li>Parçacık çarpışmaları elastiktir (enerji korunur)</li>
                      <li>Ortalama kinetik enerji sıcaklıkla orantılıdır</li>
                      <li>Basınç, parçacıkların kap duvarlarına çarpmasından kaynaklanır</li>
                      <li>Aynı sıcaklıkta, daha hafif gazlar daha yüksek ortalama hızlara sahiptir</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="gas-mixtures" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-6">
            <Card className="w-full md:w-1/3">
              <CardHeader>
                <CardTitle>Gaz Karışımı Özellikleri</CardTitle>
                <CardDescription>Dalton'un Kısmi Basınçlar Kanunu'nu keşfedin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="gas1-type">Birinci Gaz</Label>
                  <Select value={gas1Name} onValueChange={(value: GasName) => setGas1Name(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Gaz seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(GASES).map((gas) => (
                        <SelectItem key={gas} value={gas}>{gas}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gas2-type">İkinci Gaz</Label>
                  <Select value={gas2Name} onValueChange={(value: GasName) => setGas2Name(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Gaz seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(GASES).map((gas) => (
                        <SelectItem key={gas} value={gas}>{gas}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Birinci Gaz Mol Fraksiyonu</Label>
                  <div className="flex items-center gap-2">
                    <Slider 
                      min={0.1} 
                      max={0.9} 
                      step={0.1} 
                      value={[gas1Fraction]} 
                      onValueChange={(values) => setGas1Fraction(values[0])} 
                    />
                    <span className="w-10 text-right">{(gas1Fraction * 100).toFixed(0)}%</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Sıcaklık (K)</Label>
                  <div className="flex items-center gap-2">
                    <Slider 
                      min={100} 
                      max={1000} 
                      step={10} 
                      value={[temperature]} 
                      onValueChange={(values) => setTemperature(values[0])} 
                    />
                    <span className="w-10 text-right">{temperature}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Toplam Basınç (atm)</Label>
                  <div className="flex items-center gap-2">
                    <Slider 
                      min={0.1} 
                      max={10} 
                      step={0.1} 
                      value={[pressure]} 
                      onValueChange={(values) => setPressure(values[0])} 
                    />
                    <span className="w-10 text-right">{pressure}</span>
                  </div>
                </div>

                <div className="pt-4">
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                    <h3 className="font-medium mb-2">Dalton'un Kısmi Basınçlar Yasası</h3>
                    <p className="text-sm mb-2">Bir gaz karışımının toplam basıncı, her bir gazın kısmi basınçlarının toplamına eşittir:</p>
                    <p className="text-center font-medium my-2">P<sub>toplam</sub> = P<sub>1</sub> + P<sub>2</sub> + ... + P<sub>n</sub></p>
                    <p className="text-sm">Bir gazın kısmi basıncı, karışımdaki mol fraksiyonu ile orantılıdır:</p>
                    <p className="text-center font-medium my-2">P<sub>i</sub> = x<sub>i</sub> × P<sub>toplam</sub></p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="w-full md:w-2/3">
              <CardHeader>
                <CardTitle>Gaz Karışımı Görselleştirmesi</CardTitle>
                <CardDescription>Gaz karışımının görsel temsili</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] bg-gray-50 dark:bg-gray-900 rounded-md">
                  <canvas 
                    ref={canvasRef} 
                    className="w-full h-full rounded-md"
                    width={800}
                    height={400}
                  />
                </div>
                
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md mt-4">
                  <h3 className="font-medium mb-2">Mevcut Karışım Özellikleri</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 text-sm">
                    <div>Toplam basınç:</div>
                    <div className="font-medium">{pressure.toFixed(2)} atm</div>
                    <div></div>
                    
                    <div>{gas1Name} kısmi basıncı:</div>
                    <div className="font-medium">{(pressure * gas1Fraction).toFixed(2)} atm</div>
                    <div className="font-medium">{(gas1Fraction * 100).toFixed(0)}%</div>
                    
                    <div>{gas2Name} kısmi basıncı:</div>
                    <div className="font-medium">{(pressure * (1 - gas1Fraction)).toFixed(2)} atm</div>
                    <div className="font-medium">{((1 - gas1Fraction) * 100).toFixed(0)}%</div>
                    
                    <div>Sıcaklık:</div>
                    <div className="font-medium">{temperature} K</div>
                    <div></div>
                    
                    <div>Ortalama molar kütle:</div>
                    <div className="font-medium">
                      {(GASES[gas1Name].molarMass * gas1Fraction + 
                        GASES[gas2Name].molarMass * (1 - gas1Fraction)).toFixed(2)} g/mol
                    </div>
                    <div></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="real-gases" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-6">
            <Card className="w-full md:w-1/3">
              <CardHeader>
                <CardTitle>Gerçek Gaz Davranışı</CardTitle>
                <CardDescription>İdeal ve gerçek gaz modellerini karşılaştırın</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="gas-type">Gaz Türü</Label>
                  <Select value={gasName} onValueChange={(value: GasName) => setGasName(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Gaz seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(GASES).map((gas) => (
                        <SelectItem key={gas} value={gas}>{gas}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Mol Sayısı (n)</Label>
                  <div className="flex items-center gap-2">
                    <Slider 
                      min={0.1} 
                      max={5} 
                      step={0.1} 
                      value={[moles]} 
                      onValueChange={(values) => setMoles(values[0])} 
                    />
                    <span className="w-10 text-right">{moles}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Sıcaklık (K)</Label>
                  <div className="flex items-center gap-2">
                    <Slider 
                      min={100} 
                      max={1000} 
                      step={10} 
                      value={[temperature]} 
                      onValueChange={(values) => setTemperature(values[0])} 
                    />
                    <span className="w-10 text-right">{temperature}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Basınç (atm)</Label>
                  <div className="flex items-center gap-2">
                    <Slider 
                      min={0.1} 
                      max={10} 
                      step={0.1} 
                      value={[pressure]} 
                      onValueChange={(values) => setPressure(values[0])} 
                    />
                    <span className="w-10 text-right">{pressure}</span>
                  </div>
                </div>

                <div className="pt-4">
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                    <h3 className="font-medium mb-2">{gasName} için Van der Waals Parametreleri</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>a (L²·atm/mol²):</div>
                      <div className="font-medium">{GASES[gasName].vanDerWaalsA}</div>
                      <div>b (L/mol):</div>
                      <div className="font-medium">{GASES[gasName].vanDerWaalsB}</div>
                      <div>Kritik sıcaklık:</div>
                      <div className="font-medium">{GASES[gasName].criticalTemperature} K</div>
                      <div>Kritik basınç:</div>
                      <div className="font-medium">{GASES[gasName].criticalPressure} atm</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md mt-4">
                  <h3 className="font-medium mb-2">Hacim Karşılaştırması</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>İdeal gaz hacmi:</div>
                    <div className="font-medium">{calculateVolume(moles, temperature, pressure, 'ideal', gasName).toFixed(2)} L</div>
                    <div>Van der Waals hacmi:</div>
                    <div className="font-medium">{calculateVolume(moles, temperature, pressure, 'vanderwaals', gasName).toFixed(2)} L</div>
                    <div>Sapma:</div>
                    <div className="font-medium">
                      {((calculateVolume(moles, temperature, pressure, 'vanderwaals', gasName) / 
                         calculateVolume(moles, temperature, pressure, 'ideal', gasName) - 1) * 100).toFixed(2)}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="w-full md:w-2/3">
              <CardHeader>
                <CardTitle>Gaz Modellerinin Karşılaştırması</CardTitle>
                <CardDescription>
                  <span className="mr-4">Grafik türü seçin:</span>
                  <Select value={chartType} onValueChange={(value: ChartType) => setChartType(value as ChartType)}>
                    <SelectTrigger className="w-52">
                      <SelectValue placeholder="Grafik türü seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pressure-volume">Basınç - Hacim</SelectItem>
                      <SelectItem value="pressure-temperature">Basınç - Sıcaklık</SelectItem>
                      <SelectItem value="volume-temperature">Hacim - Sıcaklık</SelectItem>
                    </SelectContent>
                  </Select>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] bg-gray-50 dark:bg-gray-900 rounded-md">
                  <canvas 
                    ref={canvasRef} 
                    className="w-full h-full rounded-md"
                    width={800}
                    height={400}
                  />
                </div>
                
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md mt-4">
                  <h3 className="font-medium mb-2">Gerçek Gazların İdeal Davranıştan Sapma Nedenleri</h3>
                  <p className="text-sm mb-2">İdeal gaz modeli şunları varsayar:</p>
                  <ul className="list-disc pl-5 text-sm space-y-1 mb-2">
                    <li>Gaz parçacıklarının sıfır hacmi vardır</li>
                    <li>Parçacıklar arasında çekim/itme kuvvetleri yoktur</li>
                    <li>Tamamen elastik çarpışmalar gerçekleşir</li>
                  </ul>
                  <p className="text-sm mb-2">Van der Waals denklemi şunları hesaba katar:</p>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>Gaz moleküllerinin gerçek hacmi (b terimi)</li>
                    <li>Moleküller arası çekim kuvvetleri (a terimi)</li>
                  </ul>
                  <p className="text-sm mt-2">Sapmalar yüksek basınçlarda ve düşük sıcaklıklarda en belirgindir.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}