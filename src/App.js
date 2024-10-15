import React, { useEffect, useState } from 'react';
import Main from './components/Main';

function App() {
  const [coords, setCoords] = useState(null);

  // Get user's location on page load
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ latitude, longitude });
      },
      (error) => {
        console.error('Error getting location: ', error);
        setCoords({ latitude: -33.8688, longitude: 151.2093 }); // Default: Sydney
      }
    );
  }, []);

  return (
    <div className="App">
      {coords ? <Main coords={coords} /> : <p>Loading location...</p>}
    </div>
  );
}

export default App;