import config from '../config';

import zones from './gentKotZones';

export function isInGent(coordinatesHome) {
  const x = coordinatesHome[0];
  const y = coordinatesHome[1];
  let inside = false;


  zones.gentKotZones.forEach((zone) => {
    zone.forEach((coordinates) => {
      // eslint-disable-next-line no-plusplus
      for (let i = 0, j = coordinates.length - 1; i < coordinates.length; j = i++) {
        const xi = coordinates[i][0];
        const yi = coordinates[i][1];
        const xj = coordinates[j][0];
        const yj = coordinates[j][1];

        const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
      }
    });
  });
  // });

  return inside;
}


export const getCoordinateOfAddress = (urlAddress) => {
  // fetch this
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${urlAddress}.json?access_token=${config.mapBoxToken}&cachebuster=1545257251767&autocomplete=true&limit=1`;


  if (config.mapBoxToken) {
    fetch(url, {
      method: 'GET',
    })
      .then(response => response.json())
      .then((data) => {
        // Binnen deze functie kan je de json data manipuleren
        console.log(data);
        console.log(data.features[0].geometry.coordinates[0]);
        console.log(data.features[0].geometry.coordinates[1]);

        localStorage.setItem('homeAddressLong', data.features[0].geometry.coordinates[0]);
        localStorage.setItem('homeAddressLat', data.features[0].geometry.coordinates[1]);
      });
  }
};


export const getDistance = (lat1, lon1, lat2, lon2, unit) => {
  // 'M' is statute miles (default)
  // 'K' is kilometers
  // 'N' is nautical miles
  const radlat1 = (Math.PI * lat1) / 180;
  const radlat2 = (Math.PI * lat2) / 180;
  const theta = lon1 - lon2;
  const radtheta = (Math.PI * theta) / 180;
  let dist = Math.sin(radlat1) * Math.sin(radlat2)
    + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  if (dist > 1) {
    dist = 1;
  }
  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515;
  if (unit === 'K') {
    dist *= 1.609344;
  }
  if (unit === 'N') {
    dist *= 0.8684;
  }

  // console.log(`${lat1} - ${lon1} - ${lat2} - ${lon2} - `);
  return dist.toFixed(2);
};
