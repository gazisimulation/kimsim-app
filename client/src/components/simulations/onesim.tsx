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
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="refresh" content="0; url=https://gazisimulation.github.io/onesim.html" />
    <title>Redirecting...</title>
</head>
<body>
    <p>If you are not redirected automatically, follow this <a href="https://gazisimulation.github.io/onesim.html">link</a>.</p>
</body>
</html>
  );
};

export default OneSim;
