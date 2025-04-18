import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AtomIcon, Link2, Unlink, Atom, ZapIcon, GridIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ChemicalBondsSimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('metallic');
  const [isLoading, setIsLoading] = useState(true);
  const [description, setDescription] = useState<string>('');

  useEffect(() => {
    // Load Three.js and OrbitControls
    const threeScript = document.createElement('script');
    threeScript.src = 'https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.min.js';
    threeScript.async = true;
    
    const orbitControlsScript = document.createElement('script');
    orbitControlsScript.src = 'https://cdn.jsdelivr.net/npm/three@0.132.2/examples/js/controls/OrbitControls.js';
    orbitControlsScript.async = true;
    
    threeScript.onload = () => {
      document.body.appendChild(orbitControlsScript);
    };
    
    orbitControlsScript.onload = () => {
      setIsLoading(false);
      initializeSimulation();
    };
    
    document.body.appendChild(threeScript);

    return () => {
      document.body.removeChild(threeScript);
      if (document.body.contains(orbitControlsScript)) {
        document.body.removeChild(orbitControlsScript);
      }
      
      // Clean up any Three.js resources
      if (window.THREE) {
        const canvas = canvasRef.current;
        if (canvas) {
          const context = canvas.getContext('webgl');
          if (context) {
            context.getExtension('WEBGL_lose_context')?.loseContext();
          }
        }
      }
    };
  }, []);

  useEffect(() => {
    // Handle resize
    const handleResize = () => {
      if (canvasRef.current && containerRef.current && window.THREE && window.renderer) {
        const width = containerRef.current.clientWidth;
        const height = 400; // Fixed height
        
        window.renderer.setSize(width, height);
        
        // Update camera aspect ratio
        if (window.camera) {
          window.camera.aspect = width / height;
          window.camera.updateProjectionMatrix();
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isLoading && window.loadSimulation) {
      window.loadSimulation(activeTab);
    }
  }, [activeTab, isLoading]);

  // Function to initialize the Three.js simulation
  const initializeSimulation = () => {
    if (!window.THREE || !canvasRef.current || !containerRef.current) return;
    
    const THREE = window.THREE;
    const width = containerRef.current.clientWidth;
    const height = 400; // Fixed height
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 15;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      antialias: true 
    });
    renderer.setSize(width, height);
    
    // Add orbit controls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Current simulation state
    let currentSimulation = null;
    
    // Function to clear the simulation
    const clearSimulation = () => {
      while(scene.children.length > 0) { 
        const object = scene.children[0];
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            for (let i = 0; i < object.material.length; ++i) {
              object.material[i].dispose();
            }
          } else {
            object.material.dispose();
          }
        }
        scene.remove(object); 
      }
      
      // Add lights back
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(1, 1, 1);
      scene.add(directionalLight);
    };
    
    // Create Metallic Bond Simulation
    const createMetallicBondSimulation = () => {
      const metalGroup = new THREE.Group();
      scene.add(metalGroup);
      
      // Create a lattice of metal atoms
      const atoms = [];
      const latticeSize = 3;
      const spacing = 3;
      
      // Create metal ions in lattice
      for (let x = -latticeSize; x <= latticeSize; x++) {
        for (let y = -latticeSize; y <= latticeSize; y++) {
          for (let z = -latticeSize; z <= latticeSize; z++) {
            if (Math.abs(x) === latticeSize || Math.abs(y) === latticeSize || Math.abs(z) === latticeSize) {
              const geometry = new THREE.SphereGeometry(0.5, 32, 32);
              const material = new THREE.MeshPhongMaterial({ color: 0xcccccc });
              const atom = new THREE.Mesh(geometry, material);
              atom.position.set(x * spacing, y * spacing, z * spacing);
              metalGroup.add(atom);
              atoms.push(atom);
            }
          }
        }
      }
      
      // Create electron cloud (particles representing free electrons)
      const electrons = [];
      const electronCount = 100;
      
      for (let i = 0; i < electronCount; i++) {
        const geometry = new THREE.SphereGeometry(0.1, 16, 16);
        const material = new THREE.MeshBasicMaterial({ color: 0x0099ff });
        const electron = new THREE.Mesh(geometry, material);
        
        // Random position within the lattice bounds
        const size = latticeSize * spacing;
        electron.position.set(
          (Math.random() - 0.5) * size * 1.8,
          (Math.random() - 0.5) * size * 1.8,
          (Math.random() - 0.5) * size * 1.8
        );
        
        // Random velocity
        electron.velocity = new THREE.Vector3(
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.1
        );
        
        metalGroup.add(electron);
        electrons.push(electron);
      }
      
      // Scale the entire group
      metalGroup.scale.set(0.5, 0.5, 0.5);
      
      // Adjust camera
      camera.position.set(0, 0, 15);
      controls.update();
      
      // Update function for animation
      function update() {
        // Move electrons
        electrons.forEach(electron => {
          electron.position.add(electron.velocity);
          
          // Bounce off boundaries
          const boundSize = latticeSize * spacing * 0.9;
          ['x', 'y', 'z'].forEach(axis => {
            if (Math.abs(electron.position[axis]) > boundSize) {
              electron.velocity[axis] *= -1;
            }
          });
        });
        
        // Rotate the entire lattice slowly
        metalGroup.rotation.y += 0.002;
        metalGroup.rotation.x += 0.001;
      }
      
      // Description text
      const description = `
        <h3>Metalik Bağ</h3>
        <p>Metalik bağ, atomların bir kafes yapısı oluşturduğu metallerde meydana gelir. Değerlik elektronları yer değiştirir ve pozitif metal iyonları arasında serbestçe hareket eden bir "elektron denizi" oluşturur.</p>
        <p>Bu elektron hareketliliği metallerin birçok özelliğini açıklar:</p>
        <ul>
          <li>Yüksek elektrik iletkenliği</li>
          <li>Isı iletkenliği</li>
          <li>Çekme ve dövülebilirlik</li>
          <li>Metalik parlaklık</li>
        </ul>
        <p>Bu simülasyonda, gümüş küreler, hareketli değerlik elektronları yapının içinde serbestçe hareket eden küçük mavi kürelerken, bir kafes içinde düzenlenmiş metal atomlarını temsil eder.</p>
      `;
      
      setDescription(description);
      
      return { update, description };
    };
    
    // Create Ionic Bond Simulation
    const createIonicBondSimulation = () => {
      const ionicGroup = new THREE.Group();
      scene.add(ionicGroup);
      
      // Create a sodium chloride (NaCl) crystal structure
      const latticeSize = 2;
      const spacing = 2.5;
      
      // Create sodium (Na+) and chloride (Cl-) ions in alternating positions
      for (let x = -latticeSize; x <= latticeSize; x++) {
        for (let y = -latticeSize; y <= latticeSize; y++) {
          for (let z = -latticeSize; z <= latticeSize; z++) {
            // Skip some positions to create a cubic structure with visible internal structure
            if (Math.abs(x) === latticeSize || Math.abs(y) === latticeSize || Math.abs(z) === latticeSize) {
              // Determine if this should be Na+ or Cl- based on position
              const isNa = (x + y + z) % 2 === 0;
              
              const geometry = new THREE.SphereGeometry(isNa ? 0.6 : 0.9, 32, 32);
              const material = new THREE.MeshPhongMaterial({ 
                color: isNa ? 0x0066cc : 0x00cc66,
                transparent: true,
                opacity: 0.8,
              });
              
              const ion = new THREE.Mesh(geometry, material);
              ion.position.set(x * spacing, y * spacing, z * spacing);
              
              // Add a charge indicator
              const chargeGeometry = new THREE.SphereGeometry(0.2, 16, 16);
              const chargeMaterial = new THREE.MeshBasicMaterial({ 
                color: isNa ? 0xff3333 : 0x3333ff 
              });
              const charge = new THREE.Mesh(chargeGeometry, chargeMaterial);
              
              // Position charge indicator
              charge.position.y = 0.5;
              
              // Add + or - text
              const text = document.createElement('div');
              text.className = 'charge-text';
              text.textContent = isNa ? '+' : '-';
              text.style.color = 'white';
              text.style.position = 'absolute';
              
              ion.add(charge);
              ionicGroup.add(ion);
            }
          }
        }
      }
      
      // Add electrostatic field lines
      const addFieldLines = () => {
        for (let i = 0; i < 20; i++) {
          const curve = new THREE.CubicBezierCurve3(
            new THREE.Vector3(-spacing, 0, (Math.random() - 0.5) * spacing * 2),
            new THREE.Vector3(-spacing/3, (Math.random() - 0.5) * spacing, (Math.random() - 0.5) * spacing * 2),
            new THREE.Vector3(spacing/3, (Math.random() - 0.5) * spacing, (Math.random() - 0.5) * spacing * 2),
            new THREE.Vector3(spacing, 0, (Math.random() - 0.5) * spacing * 2)
          );
          
          const points = curve.getPoints(50);
          const fieldGeometry = new THREE.BufferGeometry().setFromPoints(points);
          const fieldMaterial = new THREE.LineBasicMaterial({ 
            color: 0xffff00, 
            transparent: true,
            opacity: 0.3
          });
          
          const fieldLine = new THREE.Line(fieldGeometry, fieldMaterial);
          fieldLine.rotation.z = Math.random() * Math.PI;
          ionicGroup.add(fieldLine);
        }
      };
      
      addFieldLines();
      
      // Scale the entire group
      ionicGroup.scale.set(0.8, 0.8, 0.8);
      
      // Adjust camera
      camera.position.set(0, 0, 12);
      controls.update();
      
      // Animation function
      function update() {
        ionicGroup.rotation.y += 0.005;
      }
      
      // Description
      const description = `
        <h3>İyonik Bağ</h3>
        <p>İyonik bağ, bir metal ve bir ametal element arasında meydana gelir. Metal atomu bir veya daha fazla elektron kaybeder ve pozitif yüklü bir iyon (katyon) olur. Ametal atomu elektron kazanır ve negatif yüklü bir iyon (anyon) olur.</p>
        <p>Zıt yüklü iyonlar arasındaki güçlü elektrostatik çekim, iyonik bağı oluşturur. Bu, sodyum klorür (NaCl) gibi kristal bir kafes yapısı ile sonuçlanır.</p>
        <p>Bu simülasyonda:</p>
        <ul>
          <li>Mavi küreler: Sodyum iyonları (Na+)</li>
          <li>Yeşil küreler: Klor iyonları (Cl-)</li>
          <li>Sarı çizgiler: Elektrostatik alan çizgilerinin gösterimi</li>
        </ul>
        <p>İyonik bileşikler yüksek erime noktalarına sahiptir, genellikle kırılganlardır ve suya veya erimiş halde çözündüklerinde elektrik iletkenliği gösterirler.</p>
      `;
      
      setDescription(description);
      
      return { update, description };
    };
    
    // Create Covalent Bond Simulation
    const createCovalentBondSimulation = () => {
      const covalentGroup = new THREE.Group();
      scene.add(covalentGroup);
      
      // Create a water molecule (H2O) as an example of covalent bonding
      
      // Oxygen atom (red)
      const oxygenGeometry = new THREE.SphereGeometry(1, 32, 32);
      const oxygenMaterial = new THREE.MeshPhongMaterial({ color: 0xff3333 });
      const oxygen = new THREE.Mesh(oxygenGeometry, oxygenMaterial);
      covalentGroup.add(oxygen);
      
      // Hydrogen atoms (white)
      const hydrogenGeometry = new THREE.SphereGeometry(0.5, 32, 32);
      const hydrogenMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
      
      const hydrogen1 = new THREE.Mesh(hydrogenGeometry, hydrogenMaterial);
      hydrogen1.position.set(-0.8, 0.6, 0);
      covalentGroup.add(hydrogen1);
      
      const hydrogen2 = new THREE.Mesh(hydrogenGeometry, hydrogenMaterial);
      hydrogen2.position.set(0.8, 0.6, 0);
      covalentGroup.add(hydrogen2);
      
      // Add shared electron pairs (bonds)
      const createSharedElectrons = (start, end) => {
        // Direction vector
        const dir = new THREE.Vector3().subVectors(end, start).normalize();
        
        // Bond center point
        const midPoint = new THREE.Vector3().addVectors(
          start.clone().multiplyScalar(0.6),
          end.clone().multiplyScalar(0.4)
        );
        
        // Create electron cloud around bond
        const electrons = new THREE.Group();
        
        // Add electrons
        const electronGeometry = new THREE.SphereGeometry(0.12, 16, 16);
        const electronMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff });
        
        // Create a plane perpendicular to the bond direction
        const perpVector1 = new THREE.Vector3(1, 0, 0);
        if (Math.abs(dir.dot(perpVector1)) > 0.9) {
          perpVector1.set(0, 1, 0);
        }
        
        const perpVector2 = new THREE.Vector3().crossVectors(dir, perpVector1).normalize();
        perpVector1.crossVectors(perpVector2, dir).normalize();
        
        // Add shared electrons
        const radius = 0.3;
        for (let i = 0; i < 2; i++) {
          const angle = (i / 2) * Math.PI * 2;
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);
          
          const position = new THREE.Vector3()
            .addVectors(
              midPoint,
              perpVector1.clone().multiplyScalar(x).add(perpVector2.clone().multiplyScalar(y))
            );
          
          const electron = new THREE.Mesh(electronGeometry, electronMaterial);
          electron.position.copy(position);
          electrons.add(electron);
        }
        
        // Create bond cylinder
        const bondGeometry = new THREE.CylinderGeometry(0.1, 0.1, start.distanceTo(end) * 0.4, 8);
        const bondMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc, transparent: true, opacity: 0.6 });
        const bond = new THREE.Mesh(bondGeometry, bondMaterial);
        
        // Position and orient bond
        const midPoint2 = new THREE.Vector3().addVectors(
          start.clone().multiplyScalar(0.8),
          end.clone().multiplyScalar(0.2)
        );
        bond.position.copy(midPoint2);
        
        // Orient cylinder to point from start to end
        bond.lookAt(end);
        bond.rotateX(Math.PI / 2);
        
        electrons.add(bond);
        return electrons;
      };
      
      // Add bonds
      const bond1 = createSharedElectrons(oxygen.position, hydrogen1.position);
      const bond2 = createSharedElectrons(oxygen.position, hydrogen2.position);
      
      covalentGroup.add(bond1);
      covalentGroup.add(bond2);
      
      // Scale molecule
      covalentGroup.scale.set(2, 2, 2);
      
      // Lone pairs on oxygen
      const lonePairGeometry = new THREE.SphereGeometry(0.15, 16, 16);
      const lonePairMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff });
      
      // Add lone pairs on oxygen (2 pairs)
      const lonePairs = new THREE.Group();
      
      // First lone pair
      const lp1a = new THREE.Mesh(lonePairGeometry, lonePairMaterial);
      lp1a.position.set(0, -0.5, 0.3);
      const lp1b = new THREE.Mesh(lonePairGeometry, lonePairMaterial);
      lp1b.position.set(0, -0.5, -0.3);
      
      // Second lone pair
      const lp2a = new THREE.Mesh(lonePairGeometry, lonePairMaterial);
      lp2a.position.set(0, -0.3, 0.5);
      const lp2b = new THREE.Mesh(lonePairGeometry, lonePairMaterial);
      lp2b.position.set(0, -0.3, -0.5);
      
      lonePairs.add(lp1a);
      lonePairs.add(lp1b);
      lonePairs.add(lp2a);
      lonePairs.add(lp2b);
      
      covalentGroup.add(lonePairs);
      
      // Add partial charges to show polarity
      const deltaGeometry = new THREE.SphereGeometry(0.2, 16, 16);
      
      // δ- (delta minus) on oxygen
      const deltaMinus = new THREE.Mesh(
        deltaGeometry,
        new THREE.MeshBasicMaterial({ color: 0x3333ff })
      );
      deltaMinus.position.set(0, -1, 0);
      covalentGroup.add(deltaMinus);
      
      // δ+ (delta plus) on hydrogens
      const deltaPlus1 = new THREE.Mesh(
        deltaGeometry,
        new THREE.MeshBasicMaterial({ color: 0xff3333 })
      );
      deltaPlus1.position.set(-1.2, 0.8, 0);
      deltaPlus1.scale.set(0.7, 0.7, 0.7);
      covalentGroup.add(deltaPlus1);
      
      const deltaPlus2 = new THREE.Mesh(
        deltaGeometry,
        new THREE.MeshBasicMaterial({ color: 0xff3333 })
      );
      deltaPlus2.position.set(1.2, 0.8, 0);
      deltaPlus2.scale.set(0.7, 0.7, 0.7);
      covalentGroup.add(deltaPlus2);
      
      // Adjust camera
      camera.position.set(0, 0, 10);
      controls.update();
      
      // Animation function
      function update() {
        // Make the shared electrons rotate
        bond1.rotation.z += 0.02;
        bond2.rotation.z += 0.02;
        
        // Rotate the entire molecule slowly
        covalentGroup.rotation.y += 0.005;
        covalentGroup.rotation.x += 0.002;
      }
      
      // Description
      const description = `
        <h3>Kovalent Bağ</h3>
        <p>Kovalent bağ, ametal atomları arasında meydana gelir. Atomlar kararlı bir elektron konfigürasyonuna ulaşmak için elektron çiftlerini paylaşırlar.</p>
        <p>Bu simülasyon, polar kovalent bağ gösteren bir su (H<sub>2</sub>O) molekülünü göstermektedir:</p>
        <ul>
          <li>Kırmızı küre: Oksijen atomu</li>
          <li>Beyaz küreler: Hidrojen atomları</li>
          <li>Cyan küreler: Paylaşılan elektron çiftleri (bağlar)</li>
          <li>Oksijen üzerinde mavi küre: Kısmi negatif yük (δ-)</li>
          <li>Hidrojenler üzerinde kırmızı küreler: Kısmi pozitif yükler (δ+)</li>
        </ul>
        <p>Oksijen ve hidrojen arasındaki elektronegatiflik farkı, polar bir molekül oluşturur ve bu da suyun yüksek kaynama noktası ve birçok maddeyi çözebilme özelliği gibi benzersiz özelliklerini açıklar.</p>
      `;
      
      setDescription(description);
      
      return { update, description };
    };
    
    // Function to load a specific simulation
    const loadSimulation = (type) => {
      // Clear previous simulation
      clearSimulation();
      
      // Load the requested simulation
      switch (type) {
        case 'metallic':
          currentSimulation = createMetallicBondSimulation();
          break;
        case 'ionic':
          currentSimulation = createIonicBondSimulation();
          break;
        case 'covalent':
          currentSimulation = createCovalentBondSimulation();
          break;
      }
    };
    
    // Make functions available globally
    window.loadSimulation = loadSimulation;
    window.camera = camera;
    window.renderer = renderer;
    
    // Initial simulation
    loadSimulation('metallic');
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      
      // Update current simulation if there is any animation
      if (currentSimulation && currentSimulation.update) {
        currentSimulation.update();
      }
      
      renderer.render(scene, camera);
    };
    
    animate();
  };

  return (
    <div className="flex flex-col lg:flex-row items-start justify-center gap-6">
      <Card className="w-full lg:w-1/3">
        <CardHeader>
          <CardTitle>Kimyasal Bağlar</CardTitle>
          <CardDescription>3B'de farklı kimyasal bağ türlerini keşfedin</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="metallic" className="flex items-center justify-center">
                <AtomIcon className="mr-2 h-4 w-4" /> Metalik
              </TabsTrigger>
              <TabsTrigger value="ionic" className="flex items-center justify-center">
                <ZapIcon className="mr-2 h-4 w-4" /> İyonik
              </TabsTrigger>
              <TabsTrigger value="covalent" className="flex items-center justify-center">
                <Link2 className="mr-2 h-4 w-4" /> Kovalent
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="mt-4 prose dark:prose-invert prose-sm max-w-none">
            <div dangerouslySetInnerHTML={{ __html: description }} />
          </div>
        </CardContent>
      </Card>
      
      <div className="w-full lg:w-2/3">
        <Card>
          <CardHeader>
            <CardTitle>3B Görselleştirme</CardTitle>
          </CardHeader>
          <CardContent>
            <div ref={containerRef} className="w-full h-[400px] relative bg-gray-900 rounded-md overflow-hidden">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                </div>
              ) : null}
              <canvas 
                ref={canvasRef} 
                className="w-full h-full"
              />
              <div className="absolute bottom-4 left-4 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
                Döndürmek için sürükleyin | Yakınlaştırmak için kaydırın
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Add custom types to window object
declare global {
  interface Window {
    THREE: any;
    loadSimulation: (type: string) => void;
    camera: any;
    renderer: any;
  }
}