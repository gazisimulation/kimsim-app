import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">404 Sayfa Bulunamadı</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            Sayfayı yönlendiriciye eklemeyi unuttunuz mu?
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
import Head from 'next/head';
import React, { useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

const FullerenePage: React.FC = () => {
  const [isRotating, setIsRotating] = useState(true);
  const [animationKey, setAnimationKey] = useState(0); // Used to restart animation

  const animationDuration = 20; // seconds for a full 360deg rotation
  const numRingsPerAxis = 7; // Number of rings per axis for a denser sphere

  const ringColors = [
    { name: 'sky', hex: '#38bdf8' },      // sky-400
    { name: 'emerald', hex: '#34d399' },  // emerald-400
    { name: 'amber', hex: '#f59e0b' },    // amber-400
  ];

  const renderRings = () => {
    const rings = [];
    const axes = ['Y', 'X', 'Z'];
    const ringBaseClasses = `absolute w-full h-full rounded-full border-2 box-border opacity-70`;

    axes.forEach((axis, axisIndex) => {
      const colorInfo = ringColors[axisIndex % ringColors.length];
      for (let i = 0; i < numRingsPerAxis; i++) {
        const angle = (i / numRingsPerAxis) * 180;
        rings.push(
          <div
            key={`${axis}-${i}`}
            className={`${ringBaseClasses} ring-${colorInfo.name}`}
            style={{ transform: `rotate${axis}(${angle}deg)` }}
          />
        );
      }
    });
    return rings;
  };

  const toggleRotation = () => setIsRotating(!isRotating);

  const restartAnimation = () => {
    setIsRotating(false);
    // Timeout to allow CSS to remove animation class before re-adding
    setTimeout(() => {
      setAnimationKey(prevKey => prevKey + 1);
      setIsRotating(true);
    }, 50);
  };

  const containerClasses = "flex flex-col items-center justify-center min-h-screen bg-slate-900 text-slate-100 p-4 overflow-hidden";
  const sceneClasses = "w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 perspective cursor-pointer group";
  const sphereBaseClasses = "w-full h-full relative transform-style-preserve-3d";
  const sphereAnimationClasses = isRotating ? `animate-spin-complex` : '';

  const customCSS = `
    .perspective { perspective: 1200px; }
    .transform-style-preserve-3d { transform-style: preserve-3d; }
    
    .ring-sky { border-color: ${ringColors[0].hex}; box-shadow: 0 0 8px ${ringColors[0].hex}, inset 0 0 5px ${ringColors[0].hex}40; }
    .ring-emerald { border-color: ${ringColors[1].hex}; box-shadow: 0 0 8px ${ringColors[1].hex}, inset 0 0 5px ${ringColors[1].hex}40; }
    .ring-amber { border-color: ${ringColors[2].hex}; box-shadow: 0 0 8px ${ringColors[2].hex}, inset 0 0 5px ${ringColors[2].hex}40; }

    @keyframes spin-complex {
      0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
      100% { transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg); }
    }
    .animate-spin-complex {
      animation: spin-complex ${animationDuration}s linear infinite;
    }
    .central-sphere-gradient {
      background: radial-gradient(circle at 30% 30%, #475569, #1e293b);
    }
  `;

  return (
    <>
      <Head>
        <title>3D Fullerene Sphere</title>
        <meta name="description" content="Interactive 3D Fullerene-Inspired Sphere" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <style>{customCSS}</style>
      <div className={containerClasses}>
        <header className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-emerald-400 to-amber-400 pb-2">
            Fullerene 3D Explorer
          </h1>
          <p className="text-slate-400 text-sm md:text-base">An interactive, stylized 3D model inspired by fullerene structures.</p>
        </header>

        <div className={sceneClasses} onClick={toggleRotation} title={isRotating ? "Click to pause" : "Click to rotate"}>
          <div key={animationKey} className={`${sphereBaseClasses} ${sphereAnimationClasses} group-hover:scale-105 transition-transform duration-300`}>
            {renderRings()}
            <div
              className="absolute w-1/4 h-1/4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full central-sphere-gradient shadow-2xl"
            />
          </div>
        </div>

        <footer className="mt-8 flex flex-col items-center space-y-4">
          <div className="flex space-x-4">
            <button 
              onClick={toggleRotation}
              className="flex items-center px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50"
            >
              {isRotating ? <Pause size={20} className="mr-2" /> : <Play size={20} className="mr-2" />}
              {isRotating ? 'Pause' : 'Play'}
            </button>
            <button 
              onClick={restartAnimation}
              className="flex items-center px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
            >
              <RotateCcw size={20} className="mr-2" />
              Restart
            </button>
          </div>
          <p className="text-xs text-slate-500">Click the model or use buttons to control animation.</p>
        </footer>
      </div>
    </>
  );
};

export default FullerenePage;
export default function onesim() {
  import Head from 'next/head';
import React, { useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

const FullerenePage: React.FC = () => {
  const [isRotating, setIsRotating] = useState(true);
  const [animationKey, setAnimationKey] = useState(0); // Used to restart animation

  const animationDuration = 20; // seconds for a full 360deg rotation
  const numRingsPerAxis = 7; // Number of rings per axis for a denser sphere

  const ringColors = [
    { name: 'sky', hex: '#38bdf8' },      // sky-400
    { name: 'emerald', hex: '#34d399' },  // emerald-400
    { name: 'amber', hex: '#f59e0b' },    // amber-400
  ];

  const renderRings = () => {
    const rings = [];
    const axes = ['Y', 'X', 'Z'];
    const ringBaseClasses = `absolute w-full h-full rounded-full border-2 box-border opacity-70`;

    axes.forEach((axis, axisIndex) => {
      const colorInfo = ringColors[axisIndex % ringColors.length];
      for (let i = 0; i < numRingsPerAxis; i++) {
        const angle = (i / numRingsPerAxis) * 180;
        rings.push(
          <div
            key={`${axis}-${i}`}
            className={`${ringBaseClasses} ring-${colorInfo.name}`}
            style={{ transform: `rotate${axis}(${angle}deg)` }}
          />
        );
      }
    });
    return rings;
  };

  const toggleRotation = () => setIsRotating(!isRotating);

  const restartAnimation = () => {
    setIsRotating(false);
    // Timeout to allow CSS to remove animation class before re-adding
    setTimeout(() => {
      setAnimationKey(prevKey => prevKey + 1);
      setIsRotating(true);
    }, 50);
  };

  const containerClasses = "flex flex-col items-center justify-center min-h-screen bg-slate-900 text-slate-100 p-4 overflow-hidden";
  const sceneClasses = "w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 perspective cursor-pointer group";
  const sphereBaseClasses = "w-full h-full relative transform-style-preserve-3d";
  const sphereAnimationClasses = isRotating ? `animate-spin-complex` : '';

  const customCSS = `
    .perspective { perspective: 1200px; }
    .transform-style-preserve-3d { transform-style: preserve-3d; }
    
    .ring-sky { border-color: ${ringColors[0].hex}; box-shadow: 0 0 8px ${ringColors[0].hex}, inset 0 0 5px ${ringColors[0].hex}40; }
    .ring-emerald { border-color: ${ringColors[1].hex}; box-shadow: 0 0 8px ${ringColors[1].hex}, inset 0 0 5px ${ringColors[1].hex}40; }
    .ring-amber { border-color: ${ringColors[2].hex}; box-shadow: 0 0 8px ${ringColors[2].hex}, inset 0 0 5px ${ringColors[2].hex}40; }

    @keyframes spin-complex {
      0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
      100% { transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg); }
    }
    .animate-spin-complex {
      animation: spin-complex ${animationDuration}s linear infinite;
    }
    .central-sphere-gradient {
      background: radial-gradient(circle at 30% 30%, #475569, #1e293b);
    }
  `;

  return (
    <>
      <Head>
        <title>3D Fullerene Sphere</title>
        <meta name="description" content="Interactive 3D Fullerene-Inspired Sphere" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <style>{customCSS}</style>
      <div className={containerClasses}>
        <header className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-emerald-400 to-amber-400 pb-2">
            Fullerene 3D Explorer
          </h1>
          <p className="text-slate-400 text-sm md:text-base">An interactive, stylized 3D model inspired by fullerene structures.</p>
        </header>

        <div className={sceneClasses} onClick={toggleRotation} title={isRotating ? "Click to pause" : "Click to rotate"}>
          <div key={animationKey} className={`${sphereBaseClasses} ${sphereAnimationClasses} group-hover:scale-105 transition-transform duration-300`}>
            {renderRings()}
            <div
              className="absolute w-1/4 h-1/4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full central-sphere-gradient shadow-2xl"
            />
          </div>
        </div>

        <footer className="mt-8 flex flex-col items-center space-y-4">
          <div className="flex space-x-4">
            <button 
              onClick={toggleRotation}
              className="flex items-center px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50"
            >
              {isRotating ? <Pause size={20} className="mr-2" /> : <Play size={20} className="mr-2" />}
              {isRotating ? 'Pause' : 'Play'}
            </button>
            <button 
              onClick={restartAnimation}
              className="flex items-center px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
            >
              <RotateCcw size={20} className="mr-2" />
              Restart
            </button>
          </div>
          <p className="text-xs text-slate-500">Click the model or use buttons to control animation.</p>
        </footer>
      </div>
    </>
  );
};

export default FullerenePage;
}
