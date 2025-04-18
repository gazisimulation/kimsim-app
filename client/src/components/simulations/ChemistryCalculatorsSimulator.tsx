import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FlaskConical, Calculator, Beaker, Atom, Thermometer, CircleDot, Hash } from 'lucide-react';
import Big from 'big.js';

// Import existing components from the codebase
export default function ChemistryCalculatorsSimulator() {
  const [activeTab, setActiveTab] = useState('raoult');

  return (
    <div className="flex flex-col gap-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 md:grid-cols-8 mb-4 gap-2">
          <TabsTrigger value="raoult" className="flex items-center gap-2">
            <FlaskConical className="h-4 w-4" /> Raoult Yasası
          </TabsTrigger>
          <TabsTrigger value="ideal-gas" className="flex items-center gap-2">
            <Thermometer className="h-4 w-4" /> İdeal Gaz Yasası
          </TabsTrigger>
          <TabsTrigger value="atomic-mass" className="flex items-center gap-2">
            <Atom className="h-4 w-4" /> Ortalama Atom Kütlesi
          </TabsTrigger>
          <TabsTrigger value="avogadro" className="flex items-center gap-2">
            <Hash className="h-4 w-4" /> Avogadro Hesaplamaları
          </TabsTrigger>
          <TabsTrigger value="ph" className="flex items-center gap-2">
            <FlaskConical className="h-4 w-4" /> pH Hesaplayıcı
          </TabsTrigger>
          <TabsTrigger value="yield" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" /> Yüzde Verim
          </TabsTrigger>
          <TabsTrigger value="molarity" className="flex items-center gap-2">
            <Beaker className="h-4 w-4" /> Molarite & Molalite
          </TabsTrigger>
          <TabsTrigger value="quantum" className="flex items-center gap-2">
            <CircleDot className="h-4 w-4" /> Kuantum Sayıları
          </TabsTrigger>
        </TabsList>

        {/* Raoult's Law Calculator */}
        <TabsContent value="raoult" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FlaskConical className="mr-2 h-5 w-5" /> 
                Raoult Yasası Hesaplayıcısı
              </CardTitle>
              <CardDescription>Bir çözeltinin toplam buhar basıncını hesaplayın</CardDescription>
            </CardHeader>
            <CardContent>
              <RaoultsLawCalculator />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ideal Gas Law Calculator */}
        <TabsContent value="ideal-gas" className="space-y-4">
          <IdealGasLawCalculator />
        </TabsContent>

        {/* Average Atomic Mass Calculator */}
        <TabsContent value="atomic-mass" className="space-y-4">
          <AverageAtomicMassCalculator />
        </TabsContent>

        {/* Avogadro Calculator */}
        <TabsContent value="avogadro" className="space-y-4">
          <AvogadroCalculator />
        </TabsContent>

        {/* pH Calculator */}
        <TabsContent value="ph" className="space-y-4">
          <PHCalculator />
        </TabsContent>

        {/* Percent Yield Calculator */}
        <TabsContent value="yield" className="space-y-4">
          <PercentYieldCalculator />
        </TabsContent>

        {/* Molarity & Molality Calculator */}
        <TabsContent value="molarity" className="space-y-4">
          <MolarityCalculator />
        </TabsContent>

        {/* Quantum Numbers Calculator */}
        <TabsContent value="quantum" className="space-y-4">
          <QuantumNumbersCalculator />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Raoult's Law Calculator
function RaoultsLawCalculator() {
  const [a1, setA1] = useState<number | string>(1);
  const [y1, setY1] = useState<number | string>(1);
  const [a2, setA2] = useState<number | string>(1);
  const [y2, setY2] = useState<number | string>(1);
  const [result, setResult] = useState<string>("");

  useEffect(() => {
    calculate();
  }, [a1, y1, a2, y2]);

  function calculate() {
    try {
      const a1Value = new Big(a1 || 0);
      const y1Value = new Big(y1 || 0);
      const a2Value = new Big(a2 || 0);
      const y2Value = new Big(y2 || 0);

      const result = a1Value.times(y1Value).plus(a2Value.times(y2Value));
      setResult(result.toFixed(4));
    } catch (err) {
      setResult("Error in calculation");
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4 border-r pr-6">
          <Label className="text-center block">Birinci Bileşen</Label>
          <div>
            <Label htmlFor="p0-1">P₀ (Buhar Basıncı)</Label>
            <Input 
              id="p0-1" 
              type="number" 
              value={a1} 
              onChange={(e) => setA1(e.target.value)}
              min={0}
            />
          </div>
          <div>
            <Label htmlFor="x1">X (Mol Fraksiyonu)</Label>
            <Input 
              id="x1" 
              type="number" 
              value={y1} 
              onChange={(e) => setY1(e.target.value)}
              min={0}
              max={1}
              step={0.1}
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-center block">İkinci Bileşen</Label>
          <div>
            <Label htmlFor="p0-2">P₀ (Buhar Basıncı)</Label>
            <Input 
              id="p0-2" 
              type="number" 
              value={a2} 
              onChange={(e) => setA2(e.target.value)}
              min={0}
            />
          </div>
          <div>
            <Label htmlFor="x2">X (Mol Fraksiyonu)</Label>
            <Input 
              id="x2" 
              type="number" 
              value={y2} 
              onChange={(e) => setY2(e.target.value)}
              min={0}
              max={1}
              step={0.1}
            />
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-md">
        <div className="text-sm font-medium mb-2">Toplam Buhar Basıncı = P₁° × X₁ + P₂° × X₂</div>
        <div className="text-2xl font-bold">{result}</div>
      </div>
    </div>
  );
}

// The rest of the component code (IdealGasLawCalculator, AverageAtomicMassCalculator, etc.) remains the same as it was in the original file
function IdealGasLawCalculator() {
  const [calc, setCalc] = useState("PV çarpımı");
  const [p, setP] = useState<number | string>(1);
  const [v, setV] = useState<number | string>(22.4);
  const [n, setN] = useState<number | string>(1);
  const [r, setR] = useState<number | string>(0); // 0 means 22.4/273
  const [t, setT] = useState<number | string>(273);
  const [result, setResult] = useState<number | string>("");

  useEffect(() => {
    calculate();
  }, [calc, p, v, n, r, t]);

  function calculate() {
    try {
      const pValue = new Big(p || 0);
      const vValue = new Big(v || 0);
      const nValue = new Big(n || 0);
      let rValue = r === 0 ? new Big(22.4).div(273) : new Big(r || 0);
      const tValue = new Big(t || 0);

      switch (calc) {
        case "PV çarpımı":
          setResult(nValue.times(rValue).times(tValue).toFixed(3));
          break;
        case "Basınç":
          setResult(nValue.times(rValue).times(tValue).div(vValue).toFixed(3));
          break;
        case "Hacim":
          setResult(nValue.times(rValue).times(tValue).div(pValue).toFixed(3));
          break;
        case "Mol Sayısı":
          setResult(pValue.times(vValue).div(rValue.times(tValue)).toFixed(3));
          break;
        case "Sıcaklık":
          setResult(pValue.times(vValue).div(nValue.times(rValue)).toFixed(3));
          break;
      }
    } catch (err) {
      setResult("Error in calculation");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Thermometer className="mr-2 h-5 w-5" /> 
          İdeal Gaz Yasası Hesaplayıcısı
        </CardTitle>
        <CardDescription>PV = nRT - Diğer değişkenleri bildiğinizde herhangi bir değişkeni hesaplayın</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="calc">Ne hesaplamak istiyorsunuz?</Label>
            <Select value={calc} onValueChange={setCalc}>
              <SelectTrigger id="calc">
                <SelectValue placeholder="Hesaplama seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PV çarpımı">PV çarpımı</SelectItem>
                <SelectItem value="Basınç">Basınç (P)</SelectItem>
                <SelectItem value="Hacim">Hacim (V)</SelectItem>
                <SelectItem value="Mol Sayısı">Mol Sayısı (n)</SelectItem>
                <SelectItem value="Sıcaklık">Sıcaklık (T)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {calc !== "PV çarpımı" && calc !== "Basınç" && (
              <div>
                <Label htmlFor="pressure">P (atm)</Label>
                <Input 
                  id="pressure" 
                  type="number" 
                  value={p} 
                  onChange={(e) => setP(e.target.value)}
                  min={0}
                />
              </div>
            )}

            {calc !== "PV çarpımı" && calc !== "Hacim" && (
              <div>
                <Label htmlFor="volume">V (L)</Label>
                <Input 
                  id="volume" 
                  type="number" 
                  value={v} 
                  onChange={(e) => setV(e.target.value)}
                  min={0}
                />
              </div>
            )}

            {calc !== "Mol Sayısı" && (
              <div>
                <Label htmlFor="moles">n (mol)</Label>
                <Input 
                  id="moles" 
                  type="number" 
                  value={n} 
                  onChange={(e) => setN(e.target.value)}
                  min={0}
                />
              </div>
            )}

            <div>
              <Label htmlFor="gas-constant">R (gaz sabiti)</Label>
              <Select value={r.toString()} onValueChange={(value) => setR(parseFloat(value))}>
                <SelectTrigger id="gas-constant">
                  <SelectValue placeholder="R değeri seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">22.4/273 (L·atm/mol·K)</SelectItem>
                  <SelectItem value="0.082">0.082 (L·atm/mol·K)</SelectItem>
                  <SelectItem value="8.314">8.314 (J/mol·K)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {calc !== "Sıcaklık" && (
              <div>
                <Label htmlFor="temperature">T (K)</Label>
                <Input 
                  id="temperature" 
                  type="number" 
                  value={t} 
                  onChange={(e) => setT(e.target.value)}
                  min={0}
                />
              </div>
            )}
          </div>

          <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-md">
            <div className="text-sm font-medium mb-2">Sonuç:</div>
            <div className="text-2xl font-bold">{result}</div>
            <div className="text-sm text-slate-500 mt-2">
              {calc === "PV çarpımı" && "PV değeri (atm·L)"}
              {calc === "Basınç" && "Basınç (atm)"}
              {calc === "Hacim" && "Hacim (L)"}
              {calc === "Mol Sayısı" && "Mol sayısı"}
              {calc === "Sıcaklık" && "Sıcaklık (K)"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AverageAtomicMassCalculator() {
  const [a1, setA1] = useState<number | string>(1);
  const [y1, setY1] = useState<number | string>(1);
  const [a2, setA2] = useState<number | string>(1);
  const [y2, setY2] = useState<number | string>(1);
  const [result, setResult] = useState<number | string>("");

  useEffect(() => {
    calculate();
  }, [a1, y1, a2, y2]);

  function calculate() {
    try {
      const a1Value = new Big(a1 || 0);
      const y1Value = new Big(y1 || 0);
      const a2Value = new Big(a2 || 0);
      const y2Value = new Big(y2 || 0);

      // Calculate average atomic mass
      const weightedSum = a1Value.times(y1Value).plus(a2Value.times(y2Value));
      const result = weightedSum.div(100);
      setResult(result.toFixed(4));
    } catch (err) {
      setResult("Error in calculation");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Atom className="mr-2 h-5 w-5" /> 
          Ortalama Atom Kütlesi Hesaplayıcısı
        </CardTitle>
        <CardDescription>İzotopları olan bir elementin ortalama atom kütlesini hesaplayın</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4 border-r pr-6">
              <Label className="text-center block">Birinci İzotop</Label>
              <div>
                <Label htmlFor="atomic-mass-1">Atom Kütlesi</Label>
                <Input 
                  id="atomic-mass-1" 
                  type="number" 
                  value={a1} 
                  onChange={(e) => setA1(e.target.value)}
                  min={0}
                />
              </div>
              <div>
                <Label htmlFor="abundance-1">Bolluk (%)</Label>
                <Input 
                  id="abundance-1" 
                  type="number" 
                  value={y1} 
                  onChange={(e) => setY1(e.target.value)}
                  min={0}
                  max={100}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-center block">İkinci İzotop</Label>
              <div>
                <Label htmlFor="atomic-mass-2">Atom Kütlesi</Label>
                <Input 
                  id="atomic-mass-2" 
                  type="number" 
                  value={a2} 
                  onChange={(e) => setA2(e.target.value)}
                  min={0}
                />
              </div>
              <div>
                <Label htmlFor="abundance-2">Bolluk (%)</Label>
                <Input 
                  id="abundance-2" 
                  type="number" 
                  value={y2} 
                  onChange={(e) => setY2(e.target.value)}
                  min={0}
                  max={100}
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-md">
            <div className="text-sm font-medium mb-2">Hesaplama: (a₁ × y₁ + a₂ × y₂) / 100</div>
            <div className="text-2xl font-bold">{result} amu</div>
            <div className="text-sm text-slate-500 mt-2">
              Ortalama atom kütlesi (amu biriminde)
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AvogadroCalculator() {
  const [value, setValue] = useState<number | string>(1);
  const [operation, setOperation] = useState("multiply");
  const [result, setResult] = useState<string>("");
  const AVOGADRO_NUMBER = "6.022 × 10²³";
  const AVOGADRO_VALUE = 6.022e23;

  useEffect(() => {
    calculate();
  }, [value, operation]);

  function calculate() {
    try {
      const inputValue = parseFloat(value as string) || 0;

      if (operation === "multiply") {
        const result = inputValue * AVOGADRO_VALUE;
        // Format with scientific notation
        setResult(result.toExponential(4));
      } else {
        const result = inputValue / AVOGADRO_VALUE;
        // Format with scientific notation for very small numbers
        setResult(result.toExponential(4));
      }
    } catch (err) {
      setResult("Error in calculation");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Hash className="mr-2 h-5 w-5" /> 
          Avogadro Sayısı Hesaplayıcısı
        </CardTitle>
        <CardDescription>Avogadro sabitiyle ({AVOGADRO_NUMBER}) bir sayıyı çarpın veya bölün</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="avogadro-value">Sayı</Label>
            <Input 
              id="avogadro-value" 
              type="number" 
              value={value} 
              onChange={(e) => setValue(e.target.value)}
              min={0}
            />
          </div>

          <div>
            <Label className="block mb-2">İşlem</Label>
            <RadioGroup value={operation} onValueChange={setOperation} className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="multiply" id="multiply" />
                <Label htmlFor="multiply">Avogadro Sayısı ile Çarp</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="divide" id="divide" />
                <Label htmlFor="divide">Avogadro Sayısına Böl</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-md">
            <div className="text-sm font-medium mb-2">Sonuç:</div>
            <div className="text-2xl font-bold">{result}</div>
            <div className="text-sm text-slate-500 mt-2">
              {operation === "multiply" 
                ? `${value} × ${AVOGADRO_NUMBER}`
                : `${value} ÷ ${AVOGADRO_NUMBER}`}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PHCalculator() {
  const [pH, setPH] = useState<number | string>(7);
  const [result, setResult] = useState<string>("");

  useEffect(() => {
    checkPH();
  }, [pH]);

  function checkPH() {
    try {
      const pHValue = parseFloat(pH as string);

      if (isNaN(pHValue) || pHValue < 0 || pHValue > 14) {
        setResult("Lütfen 0 ile 14 arasında bir değer girin");
        return;
      }

      const closenessTo7 = Math.abs(pHValue - 7);

      if (closenessTo7 >= 3) {
        setResult(`İnsan vücudu için zararlı olabilir. Nötr pH'dan fark: ${closenessTo7.toFixed(1)}`);
      } else {
        setResult(`pH seviyesi açısından güvenli. Nötr pH'dan fark: ${closenessTo7.toFixed(1)}`);
      }
    } catch (err) {
      setResult("Hesaplamada hata");
    }
  }

  // Get color based on pH
  const getColorForPH = (ph: number): string => {
    if (ph <= 2) return "#f87171"; // Highly acidic (red)
    if (ph <= 6) return "#fbbf24"; // Acidic (orange/amber)
    if (ph <= 8) return "#34d399"; // Neutral (green)
    if (ph <= 12) return "#60a5fa"; // Basic (blue)
    return "#8b5cf6"; // Highly basic (purple)
  };

  const getDescriptionForPH = (ph: number): string => {
    if (ph <= 2) return "Çok Asidik";
    if (ph <= 6) return "Asidik";
    if (ph <= 8) return "Nötr";
    if (ph <= 12) return "Bazik";
    return "Çok Bazik";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FlaskConical className="mr-2 h-5 w-5" /> 
          pH Seviyesi Hesaplayıcısı
        </CardTitle>
        <CardDescription>Bir pH değerinin insan teması için güvenli olup olmadığını kontrol edin</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <Label htmlFor="ph-value">pH Değeri (0-14)</Label>
            <Input 
              id="ph-value" 
              type="number" 
              value={pH} 
              onChange={(e) => setPH(e.target.value)}
              min={0}
              max={14}
              step={0.1}
            />
          </div>

          <div className="relative pt-5">
            <div className="w-full h-4 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 rounded-full"></div>
            <div className="absolute top-0 -translate-x-1/2" 
              style={{ 
                left: `${(parseFloat(pH as string) / 14) * 100}%`,
                display: parseFloat(pH as string) >= 0 && parseFloat(pH as string) <= 14 ? 'block' : 'none'
              }}>
              <div className="w-4 h-4 bg-white border-2 border-gray-400 rounded-full"></div>
              <div className="mt-2 text-center text-sm font-medium">pH {pH}</div>
            </div>

            <div className="flex justify-between mt-1 text-xs text-slate-500">
              <span>0</span>
              <span>7</span>
              <span>14</span>
            </div>
          </div>

          <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-medium">Sonuç:</div>
              {parseFloat(pH as string) >= 0 && parseFloat(pH as string) <= 14 && (
                <div 
                  className="px-2 py-1 rounded-full text-xs text-white"
                  style={{ backgroundColor: getColorForPH(parseFloat(pH as string)) }}
                >
                  {getDescriptionForPH(parseFloat(pH as string))}
                </div>
              )}
            </div>
            <div className="text-lg font-medium">{result}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PercentYieldCalculator() {
  const [actual, setActual] = useState<number | string>(100);
  const [expected, setExpected] = useState<number | string>(100);
  const [result, setResult] = useState<string>("");

  useEffect(() => {
    calculatePercentageYield();
  }, [actual, expected]);

  function calculatePercentageYield() {
    try {
      const actualValue = parseFloat(actual as string) || 0;
      const expectedValue = parseFloat(expected as string) || 0;

      if (expectedValue <= 0 || actualValue < 0) {
        setResult("Lütfen geçerli değerler girin (teorik > 0, gerçek >= 0)");
        return;
      }

      const percentageYield = (actualValue / expectedValue) * 100;
      setResult(`${percentageYield.toFixed(1)}%`);
    } catch (err) {
      setResult("Hesaplamada hata");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calculator className="mr-2 h-5 w-5" /> 
          Yüzde Verim Hesaplayıcısı
        </CardTitle>
        <CardDescription>Bir kimyasal reaksiyonun verimliliğini hesaplayın</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="actual-yield">Gerçek Verim (g)</Label>
            <Input 
              id="actual-yield" 
              type="number" 
              value={actual} 
              onChange={(e) => setActual(e.target.value)}
              min={0}
            />
          </div>

          <div>
            <Label htmlFor="theoretical-yield">Teorik Verim (g)</Label>
            <Input 
              id="theoretical-yield" 
              type="number" 
              value={expected} 
              onChange={(e) => setExpected(e.target.value)}
              min={0.01}
            />
          </div>

          <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-md">
            <div className="text-sm font-medium mb-2">Hesaplama: (Gerçek Verim / Teorik Verim) × 100%</div>
            <div className="text-2xl font-bold">{result}</div>

            {parseFloat(actual as string) > 0 && parseFloat(expected as string) > 0 && (
              <div className="mt-4 relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-slate-600 bg-slate-200">
                      Verimlilik
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-slate-600">
                      {parseFloat(result) > 100 ? 100 : Math.min(parseFloat(actual as string) / parseFloat(expected as string) * 100, 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-slate-200">
                  <div style={{ width: `${Math.min(parseFloat(actual as string) / parseFloat(expected as string) * 100, 100)}%` }} 
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                      (parseFloat(actual as string) / parseFloat(expected as string)) * 100 < 50 
                        ? 'bg-red-500' 
                        : (parseFloat(actual as string) / parseFloat(expected as string)) * 100 < 90 
                          ? 'bg-amber-500' 
                          : 'bg-green-500'
                    }`}>
                  </div>
                </div>
              </div>
            )}

            <div className="text-sm text-slate-500 mt-2">
              {parseFloat(actual as string) > parseFloat(expected as string) && 
                "Not: Gerçek verim teorik verimi aşıyor, bu deneysel bir hataya işaret edebilir"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MolarityCalculator() {
  const [calcType, setCalcType] = useState("Molarity");
  const [calc, setCalc] = useState("M value");
  const [m, setM] = useState<number | string>(0);
  const [n, setN] = useState<number | string>(1);
  const [v, setV] = useState<number | string>(1);
  const [result, setResult] = useState<string>("");

  // For the second calculator (M = d × % × 10 / Ma)
  const [calcM, setCalcM] = useState("Find M");
  const [mValue, setMValue] = useState<number | string>(1);
  const [dValue, setDValue] = useState<number | string>(1);
  const [percentValue, setPercentValue] = useState<number | string>(10);
  const [maValue, setMaValue] = useState<number | string>(1);
  const [result2, setResult2] = useState<string>("");

  useEffect(() => {
    calculateMolarity();
  }, [calc, m, n, v]);

  useEffect(() => {
    calculateMolarityWithDensity();
  }, [calcM, mValue, dValue, percentValue, maValue]);

  function calculateMolarity() {
    try {
      const mValue = new Big(m || 0);
      const nValue = new Big(n || 0);
      const vValue = new Big(v || 0);

      switch (calc) {
        case "M value":
          const mResult = nValue.div(vValue);
          setResult(mResult.toFixed(3));
          break;
        case "Moles":
          const nResult = mValue.times(vValue);
          setResult(nResult.toFixed(3));
          break;
        case "Volume or Mass":
          const vResult = nValue.div(mValue);
          setResult(vResult.toFixed(3));
          break;
      }
    } catch (err) {
      setResult("Error in calculation");
    }
  }

  function calculateMolarityWithDensity() {
    try {
      const m = new Big(mValue || 0);
      const d = new Big(dValue || 0);
      const percent = new Big(percentValue || 0);
      const ma = new Big(maValue || 0);

      switch (calcM) {
        case "Find M":
          const mResult = d.times(percent).times(10).div(ma);
          setResult2(mResult.toFixed(3));
          break;
        case "Find %":
          const percentResult = m.times(ma).div(d.times(10));
          setResult2(percentResult.toFixed(3));
          break;
        case "Find density":
          const dResult = m.times(ma).div(percent.times(10));
          setResult2(dResult.toFixed(3));
          break;
        case "Find Molar Mass":
          const maResult = d.times(percent).times(10).div(m);
          setResult2(maResult.toFixed(3));
          break;
      }
    } catch (err) {
      setResult2("Error in calculation");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Beaker className="mr-2 h-5 w-5" /> 
          Molarite ve Molalite Hesaplayıcısı
        </CardTitle>
        <CardDescription>Çözeltilerin konsantrasyonunu hesaplayın</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Temel Molarite</TabsTrigger>
            <TabsTrigger value="advanced">Gelişmiş Hesaplama</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-4">
            <div>
              <Label htmlFor="molarity-calc">Ne hesaplamak istiyorsunuz?</Label>
              <Select value={calc} onValueChange={setCalc}>
                <SelectTrigger id="molarity-calc">
                  <SelectValue placeholder="Hesaplama seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M value">Molarite (M = n/V)</SelectItem>
                  <SelectItem value="Moles">Mol Sayısı (n = M×V)</SelectItem>
                  <SelectItem value="Volume or Mass">Hacim veya Kütle (V = n/M)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {calc !== "M value" && (
                <div>
                  <Label htmlFor="m-value">M (mol/L)</Label>
                  <Input 
                    id="m-value" 
                    type="number" 
                    value={m} 
                    onChange={(e) => setM(e.target.value)}
                    min={0}
                  />
                </div>
              )}

              {calc !== "Moles" && (
                <div>
                  <Label htmlFor="n-value">n (mol)</Label>
                  <Input 
                    id="n-value" 
                    type="number" 
                    value={n} 
                    onChange={(e) => setN(e.target.value)}
                    min={0}
                  />
                </div>
              )}

              {calc !== "Volume or Mass" && (
                <div>
                  <Label htmlFor="v-value">V (L) or Mass (kg)</Label>
                  <Input 
                    id="v-value" 
                    type="number" 
                    value={v} 
                    onChange={(e) => setV(e.target.value)}
                    min={0}
                  />
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-md">
              <div className="text-sm font-medium mb-2">Sonuç:</div>
              <div className="text-2xl font-bold">{result}</div>
              <div className="text-sm text-slate-500 mt-2">
                {calc === "M value" && "Molarite (mol/L)"}
                {calc === "Moles" && "Mol sayısı (mol)"}
                {calc === "Volume or Mass" && "Hacim (L) veya Kütle (kg)"}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4 mt-4">
            <div>
              <Label htmlFor="advanced-calc">What do you want to calculate?</Label>
              <Select value={calcM} onValueChange={setCalcM}>
                <SelectTrigger id="advanced-calc">
                  <SelectValue placeholder="Select calculation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Find M">Find Molarity (M)</SelectItem>
                  <SelectItem value="Find %">Find Concentration (%)</SelectItem>
                  <SelectItem value="Find density">Find Density (d)</SelectItem>
                  <SelectItem value="Find Molar Mass">Find Molar Mass (Ma)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {calcM !== "Find M" && (
                <div>
                  <Label htmlFor="m-value-adv">M (mol/L)</Label>
                  <Input 
                    id="m-value-adv" 
                    type="number" 
                    value={mValue} 
                    onChange={(e) => setMValue(e.target.value)}
                    min={0}
                  />
                </div>
              )}

              {calcM !== "Find density" && (
                <div>
                  <Label htmlFor="d-value">Density (g/mL)</Label>
                  <Input 
                    id="d-value" 
                    type="number" 
                    value={dValue} 
                    onChange={(e) => setDValue(e.target.value)}
                    min={0}
                  />
                </div>
              )}

              {calcM !== "Find %" && (
                <div>
                  <Label htmlFor="percent-value">% Concentration</Label>
                  <Input 
                    id="percent-value" 
                    type="number" 
                    value={percentValue} 
                    onChange={(e) => setPercentValue(e.target.value)}
                    min={0}
                    max={100}
                  />
                </div>
              )}

              {calcM !== "Find Molar Mass" && (
                <div>
                  <Label htmlFor="ma-value">Molar Mass (g/mol)</Label>
                  <Input 
                    id="ma-value" 
                    type="number" 
                    value={maValue} 
                    onChange={(e) => setMaValue(e.target.value)}
                    min={0}
                  />
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-md">
              <div className="text-sm font-medium mb-2">Calculation: M = d × % × 10 / Ma</div>
              <div className="text-2xl font-bold">{result2}</div>
              <div className="text-sm text-slate-500 mt-2">
                {calcM === "Find M" && "Molarity in mol/L"}
                {calcM === "Find %" && "Concentration in %"}
                {calcM === "Find density" && "Density in g/mL"}
                {calcM === "Find Molar Mass" && "Molar Mass in g/mol"}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function QuantumNumbersCalculator() {
  const [n, setN] = useState<number | string>(1);
  const [l, setL] = useState<number | string>(0);
  const [ml, setMl] = useState<number | string>(0);
  const [calc, setCalc] = useState("Calculate possible l");
  const [result, setResult] = useState<string>("");

  useEffect(() => {
    calculateQuantumNumbers();
  }, [n, l, ml, calc]);

  function calculateQuantumNumbers() {
    try {
      const nValue = parseInt(n as string);
      const lValue = parseInt(l as string);
      const mlValue = parseInt(ml as string);

      switch (calc) {
        case "Calculate n":
          // For calculating n from l (n must be greater than l)
          if (lValue >= 0) {
            setResult(`n ≥ ${lValue + 1}, so n can be ${lValue + 1}, ${lValue + 2}, ${lValue + 3}, ...`);
          } else {
            setResult("l must be non-negative");
          }
          break;

        case "Calculate possible l":
          // For calculating possible l values for a given n
          if (nValue > 0) {
            const possibleLValues = Array.from({length: nValue}, (_, i) => i);
            setResult(`For n = ${nValue}, possible l values are: ${possibleLValues.join(', ')}`);
          } else {
            setResult("n must be a positive integer");
          }
          break;

        case "Calculate possible ml":
          // For calculating possible ml values for a given l
          if (lValue >= 0) {
            const mlValues = Array.from({length: 2 * lValue + 1}, (_, i) => -lValue + i);
            setResult(`For l = ${lValue}, possible ml values are: ${mlValues.join(', ')}`);
          } else {
            setResult("l must be non-negative");
          }
          break;

        case "Check validity":
          // Check if the quantum numbers are valid
          if (nValue <= 0) {
            setResult("Invalid: n must be a positive integer");
          } else if (lValue < 0 || lValue >= nValue) {
            setResult(`Invalid: For n = ${nValue}, l must be between 0 and ${nValue - 1}`);
          } else if (mlValue < -lValue || mlValue > lValue) {
            setResult(`Invalid: For l = ${lValue}, ml must be between -${lValue} and ${lValue}`);
          } else {
            setResult(`Valid quantum numbers: n = ${nValue}, l = ${lValue}, ml = ${mlValue}`);
          }
          break;
      }
    } catch (err) {
      setResult("Error in calculation");
    }
  }

  // Helper function to get orbital name from l value
  const getOrbitalName = (l: number): string => {
    switch (l) {
      case 0: return "s";
      case 1: return "p";
      case 2: return "d";
      case 3: return "f";
      default: return `l=${l}`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CircleDot className="mr-2 h-5 w-5" /> 
          Quantum Numbers Calculator
        </CardTitle>
        <CardDescription>Calculate and validate quantum numbers for atomic orbitals</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="quantum-calc">What do you want to calculate?</Label>
            <Select value={calc} onValueChange={setCalc}>
              <SelectTrigger id="quantum-calc">
                <SelectValue placeholder="Select calculation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Calculate n">Find possible n values</SelectItem>
                <SelectItem value="Calculate possible l">Find possible l values</SelectItem>
                <SelectItem value="Calculate possible ml">Find possible ml values</SelectItem>
                <SelectItem value="Check validity">Check if quantum numbers are valid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {calc !== "Calculate n" && (
              <div>
                <Label htmlFor="n-value">Principal Quantum Number (n)</Label>
                <Input 
                  id="n-value" 
                  type="number" 
                  value={n} 
                  onChange={(e) => setN(e.target.value)}
                  min={1}
                />
                <p className="text-xs text-slate-500 mt-1">Positive integer (n ≥ 1)</p>
              </div>
            )}

            {calc !== "Calculate possible l" && (
              <div>
                <Label htmlFor="l-value">Angular Momentum Quantum Number (l)</Label>
                <Input 
                  id="l-value" 
                  type="number" 
                  value={l} 
                  onChange={(e) => setL(e.target.value)}
                  min={0}
                  max={parseInt(n as string) - 1}
                />
                <p className="text-xs text-slate-500 mt-1">0 ≤ l ≤ n-1</p>
              </div>
            )}

            {calc !== "Calculate possible ml" && calc !== "Calculate n" && calc !== "Calculate possible l" && (
              <div>
                <Label htmlFor="ml-value">Magnetic Quantum Number (ml)</Label>
                <Input 
                  id="ml-value" 
                  type="number" 
                  value={ml} 
                  onChange={(e) => setMl(e.target.value)}
                  min={-parseInt(l as string)}
                  max={parseInt(l as string)}
                />
                <p className="text-xs text-slate-500 mt-1">-l ≤ ml ≤ l</p>
              </div>
            )}
          </div>

          <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-md">
            <div className="text-sm font-medium mb-2">Result:</div>
            <div className="text-lg font-medium">{result}</div>

            {calc === "Check validity" && parseInt(n as string) > 0 && parseInt(l as string) >= 0 && parseInt(l as string) < parseInt(n as string) && (
              <div className="mt-4 text-sm">
                <p className="font-medium">Orbital designation: {n}{getOrbitalName(parseInt(l as string))}</p>
                <p className="text-slate-500 mt-1">
                  {parseInt(l as string) === 0 && "s orbital (spherical)"}
                  {parseInt(l as string) === 1 && "p orbital (dumbbell shaped, 3 orientations)"}
                  {parseInt(l as string) === 2 && "d orbital (4-lobed shape, 5 orientations)"}
                  {parseInt(l as string) === 3 && "f orbital (complex shape, 7 orientations)"}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

