import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { AtomIcon, RotateCcw } from 'lucide-react';

export default function QuantumAtomModelSimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentOrbital, setCurrentOrbital] = useState('1s');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load the simulation script
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/three@0.137.0/build/three.min.js';
    script.async = true;
    script.onload = () => {
      setIsLoading(false);
      initializeSimulation();
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
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
      if (canvasRef.current && containerRef.current && window.THREE) {
        const width = containerRef.current.clientWidth;
        const height = 400; // Fixed height
        
        // Access renderer from window object if it exists
        if (window.renderer) {
          window.renderer.setSize(width, height);
          
          // Update camera aspect ratio
          if (window.camera) {
            window.camera.aspect = width / height;
            window.camera.updateProjectionMatrix();
          }
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create atom container
    const atom = new THREE.Group();
    scene.add(atom);
    
    // Create nucleus
    const createNucleus = () => {
      // Nucleus geometry (protons and neutrons)
      const nucleusGeometry = new THREE.SphereGeometry(1, 32, 32);
      
      // Create proton material (red)
      const protonMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
      
      // Create neutron material (blue)
      const neutronMaterial = new THREE.MeshLambertMaterial({ color: 0x0000ff });
      
      // Nucleus group
      const nucleus = new THREE.Group();
      
      // Create 6 protons and 6 neutrons (Carbon atom)
      for (let i = 0; i < 6; i++) {
        const proton = new THREE.Mesh(nucleusGeometry, protonMaterial);
        const neutron = new THREE.Mesh(nucleusGeometry, neutronMaterial);
        
        // Position offset
        const offset = 0.4;
        proton.position.set(
          Math.random() * offset - offset/2,
          Math.random() * offset - offset/2,
          Math.random() * offset - offset/2
        );
        neutron.position.set(
          Math.random() * offset - offset/2,
          Math.random() * offset - offset/2,
          Math.random() * offset - offset/2
        );
        
        proton.scale.set(0.4, 0.4, 0.4);
        neutron.scale.set(0.4, 0.4, 0.4);
        
        nucleus.add(proton);
        nucleus.add(neutron);
      }
      
      return nucleus;
    };
    
    // Create s orbital
    const createSOrbital = (level, color) => {
      // Scale factor based on energy level
      const scaleFactor = level * 2;
      
      // Create spherical electron cloud for s-orbital
      const cloudGeometry = new THREE.SphereGeometry(scaleFactor, 32, 32);
      const cloudMaterial = new THREE.MeshPhongMaterial({
        color: color,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
      });
      
      const orbital = new THREE.Mesh(cloudGeometry, cloudMaterial);
      
      // Add electron particles inside the cloud
      const particleCount = 50;
      const particleGeometry = new THREE.SphereGeometry(0.1, 8, 8);
      const particleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      
      const particles = new THREE.Group();
      for (let i = 0; i < particleCount; i++) {
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        
        // Random position within the sphere
        const radius = scaleFactor * Math.random();
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        particle.position.x = radius * Math.sin(phi) * Math.cos(theta);
        particle.position.y = radius * Math.sin(phi) * Math.sin(theta);
        particle.position.z = radius * Math.cos(phi);
        
        particles.add(particle);
      }
      
      orbital.add(particles);
      return orbital;
    };
    
    // Create p orbital
    const createPOrbital = (level, color) => {
      // Scale factor based on energy level
      const scaleFactor = level * 2;
      
      // P orbitals have a dumbbell shape with two lobes
      const orbital = new THREE.Group();
      
      // Create the two lobes
      const lobeGeometry = new THREE.SphereGeometry(scaleFactor, 32, 32);
      const lobeMaterial = new THREE.MeshPhongMaterial({
        color: color,
        transparent: true,
        opacity: 0.3
      });
      
      const lobe1 = new THREE.Mesh(lobeGeometry, lobeMaterial);
      const lobe2 = new THREE.Mesh(lobeGeometry, lobeMaterial);
      
      lobe1.position.x = scaleFactor;
      lobe2.position.x = -scaleFactor;
      
      lobe1.scale.set(0.7, 0.5, 0.5);
      lobe2.scale.set(0.7, 0.5, 0.5);
      
      orbital.add(lobe1);
      orbital.add(lobe2);
      
      // Add a nodal plane
      const planeGeometry = new THREE.PlaneGeometry(scaleFactor * 2.5, scaleFactor * 2.5);
      const planeMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffffff,
        transparent: true,
        opacity: 0.1,
        side: THREE.DoubleSide
      });
      
      const plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.rotation.y = Math.PI / 2;
      orbital.add(plane);
      
      // Add electron particles
      const particleCount = 50;
      const particleGeometry = new THREE.SphereGeometry(0.08, 8, 8);
      const particleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      
      const particles = new THREE.Group();
      for (let i = 0; i < particleCount; i++) {
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        
        // Choose which lobe
        const side = Math.random() > 0.5 ? 1 : -1;
        
        // Position within the lobe
        const radius = scaleFactor * 0.7 * Math.random();
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        particle.position.x = side * (scaleFactor * 0.5 + radius * Math.sin(phi) * Math.cos(theta) * 0.5);
        particle.position.y = radius * Math.sin(phi) * Math.sin(theta) * 0.5;
        particle.position.z = radius * Math.cos(phi) * 0.5;
        
        particles.add(particle);
      }
      
      orbital.add(particles);
      return orbital;
    };
    
    // Create d orbital
    const createDOrbital = (level, color) => {
      // Scale factor based on energy level
      const scaleFactor = level * 2;
      
      // D orbitals have a complex shape with four lobes
      const orbital = new THREE.Group();
      
      // Create four lobes
      const lobeGeometry = new THREE.SphereGeometry(scaleFactor * 0.8, 32, 32);
      const lobeMaterial = new THREE.MeshPhongMaterial({
        color: color,
        transparent: true,
        opacity: 0.3
      });
      
      // Position lobes in a clover-like pattern
      const positions = [
        { x: scaleFactor, y: scaleFactor, z: 0 },
        { x: -scaleFactor, y: scaleFactor, z: 0 },
        { x: -scaleFactor, y: -scaleFactor, z: 0 },
        { x: scaleFactor, y: -scaleFactor, z: 0 }
      ];
      
      positions.forEach(pos => {
        const lobe = new THREE.Mesh(lobeGeometry, lobeMaterial);
        lobe.position.set(pos.x, pos.y, pos.z);
        lobe.scale.set(0.6, 0.6, 0.6);
        orbital.add(lobe);
      });
      
      // Add nodal planes
      const planeGeometry = new THREE.PlaneGeometry(scaleFactor * 3, scaleFactor * 3);
      const planeMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffffff,
        transparent: true,
        opacity: 0.1,
        side: THREE.DoubleSide
      });
      
      const planeXY = new THREE.Mesh(planeGeometry, planeMaterial);
      planeXY.rotation.x = Math.PI / 2;
      orbital.add(planeXY);
      
      const planeYZ = new THREE.Mesh(planeGeometry, planeMaterial);
      planeYZ.rotation.y = Math.PI / 2;
      orbital.add(planeYZ);
      
      // Add electron particles
      const particleCount = 80;
      const particleGeometry = new THREE.SphereGeometry(0.08, 8, 8);
      const particleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      
      const particles = new THREE.Group();
      for (let i = 0; i < particleCount; i++) {
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        
        // Choose which lobe
        const lobeIndex = Math.floor(Math.random() * 4);
        const pos = positions[lobeIndex];
        
        // Position within the lobe
        const radius = scaleFactor * 0.5 * Math.random();
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        particle.position.x = pos.x + radius * Math.sin(phi) * Math.cos(theta) * 0.5;
        particle.position.y = pos.y + radius * Math.sin(phi) * Math.sin(theta) * 0.5;
        particle.position.z = radius * Math.cos(phi) * 0.5;
        
        particles.add(particle);
      }
      
      orbital.add(particles);
      return orbital;
    };
    
    // Create nucleus
    const nucleus = createNucleus();
    atom.add(nucleus);
    
    // Create initial orbital (1s)
    let currentOrbitalMesh = createSOrbital(1, 0x3498db);
    atom.add(currentOrbitalMesh);
    
    // Orbital configurations
    const orbitalConfigs = [
      { name: "1s", electrons: 2, color: 0x3498db, type: "s", level: 1 },
      { name: "2s", electrons: 2, color: 0x2ecc71, type: "s", level: 2 },
      { name: "2p", electrons: 6, color: 0xe74c3c, type: "p", level: 2 },
      { name: "3s", electrons: 2, color: 0xf1c40f, type: "s", level: 3 },
      { name: "3p", electrons: 6, color: 0x9b59b6, type: "p", level: 3 },
      { name: "3d", electrons: 10, color: 0x1abc9c, type: "d", level: 3 }
    ];
    
    // Function to update orbital visualization
    const updateOrbital = (orbitalName) => {
      // Remove current orbital
      atom.remove(currentOrbitalMesh);
      
      // Find the orbital configuration
      const orbitalConfig = orbitalConfigs.find(o => o.name === orbitalName);
      
      if (!orbitalConfig) return;
      
      // Create the new orbital
      switch (orbitalConfig.type) {
        case "s":
          currentOrbitalMesh = createSOrbital(orbitalConfig.level, orbitalConfig.color);
          break;
        case "p":
          currentOrbitalMesh = createPOrbital(orbitalConfig.level, orbitalConfig.color);
          break;
        case "d":
          currentOrbitalMesh = createDOrbital(orbitalConfig.level, orbitalConfig.color);
          break;
      }
      
      // Add the new orbital
      atom.add(currentOrbitalMesh);
    };
    
    // Make functions available globally
    window.updateOrbital = updateOrbital;
    window.camera = camera;
    window.renderer = renderer;
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate atom
      atom.rotation.y += 0.005;
      atom.rotation.z += 0.002;
      
      renderer.render(scene, camera);
    };
    
    animate();
  };

  const handleOrbitalChange = (value: string) => {
    setCurrentOrbital(value);
    if (window.updateOrbital) {
      window.updateOrbital(value);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-start justify-center gap-6">
      <Card className="w-full lg:w-1/3">
        <CardHeader>
          <CardTitle>Quantum Atom Model</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="orbital-type">Orbital Type</Label>
            <Select value={currentOrbital} onValueChange={handleOrbitalChange}>
              <SelectTrigger id="orbital-type">
                <SelectValue placeholder="Select orbital" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1s">1s Orbital</SelectItem>
                <SelectItem value="2s">2s Orbital</SelectItem>
                <SelectItem value="2p">2p Orbital</SelectItem>
                <SelectItem value="3s">3s Orbital</SelectItem>
                <SelectItem value="3p">3p Orbital</SelectItem>
                <SelectItem value="3d">3d Orbital</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-2">Orbital Information</h3>
            <p className="text-sm mb-2">
              Current orbital: <span className="font-bold">{currentOrbital}</span>
            </p>
            <p className="text-sm mb-4">
              {currentOrbital === '1s' && "The 1s orbital is spherical and holds up to 2 electrons."}
              {currentOrbital === '2s' && "The 2s orbital is spherical, larger than 1s, and holds up to 2 electrons."}
              {currentOrbital === '2p' && "The 2p orbital has a dumbbell shape with 3 orientations (px, py, pz) and holds up to 6 electrons."}
              {currentOrbital === '3s' && "The 3s orbital is spherical, larger than 2s, and holds up to 2 electrons."}
              {currentOrbital === '3p' && "The 3p orbital has a dumbbell shape with 3 orientations and holds up to 6 electrons."}
              {currentOrbital === '3d' && "The 3d orbital has a complex 4-lobed shape and holds up to 10 electrons."}
            </p>
            
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <AtomIcon className="h-4 w-4" />
              <span>
                {currentOrbital === '1s' && "Energy level: 1, Angular momentum: 0"}
                {currentOrbital === '2s' && "Energy level: 2, Angular momentum: 0"}
                {currentOrbital === '2p' && "Energy level: 2, Angular momentum: 1"}
                {currentOrbital === '3s' && "Energy level: 3, Angular momentum: 0"}
                {currentOrbital === '3p' && "Energy level: 3, Angular momentum: 1"}
                {currentOrbital === '3d' && "Energy level: 3, Angular momentum: 2"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="w-full lg:w-2/3">
        <Card>
          <CardHeader>
            <CardTitle>3D Visualization</CardTitle>
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
                Drag to rotate | Scroll to zoom
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <Button 
                variant="outline" 
                onClick={() => {
                  setCurrentOrbital('1s');
                  if (window.updateOrbital) window.updateOrbital('1s');
                }}
                className="flex items-center"
              >
                <RotateCcw className="mr-2 h-4 w-4" /> Reset View
              </Button>
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
    updateOrbital: (orbitalName: string) => void;
    camera: any;
    renderer: any;
  }
}