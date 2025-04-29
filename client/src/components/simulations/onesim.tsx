import React from 'react';

const OneSim = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <iframe
        src="https://gazisimulation.github.io/onesim.html"
        title="OneSim"
        className="w-full h-screen border-none"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
};

export default OneSim;
