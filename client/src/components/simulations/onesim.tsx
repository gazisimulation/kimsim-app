import { useEffect } from 'react';

const OneSim = () => {
  useEffect(() => {
    // Redirect to the desired URL
    window.location.href = 'https://gazisimulation.github.io/onesim.html';
  }, []);

  return null; // Render nothing as the component redirects
};

export default OneSim;
