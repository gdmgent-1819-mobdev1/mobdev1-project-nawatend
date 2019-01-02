const sortAscending = (a, b) => a - b;
const sortDescending = (a, b) => b - a;

const filterByDistance = (refObjectsArr, minDistance, maxDistance) => {
  const filteredObjectsArr = [];
  refObjectsArr.forEach((refObject) => {
    if (parseInt(refObject.distanceFromStudent, 10) >= parseInt(minDistance, 10)
      && parseInt(refObject.distanceFromStudent, 10) <= parseInt(maxDistance, 10)) {
      filteredObjectsArr.push(refObject);
    } else {
      console.log(`Not filter distance${refObject.distanceFromStudent} -- ${minDistance} ${maxDistance}`);
    }
  });

  console.log('SORTEDDD in Price');
  return filteredObjectsArr;
};


const sortByDistance = (refObjectsArr, ascending = true) => {
  const arrDistance = [];
  const sortedObjectsArr = [];
  refObjectsArr.forEach((refObject) => {
    arrDistance.push(refObject.distanceFromStudent);
  });

  if (ascending) {
    arrDistance.sort(sortAscending);
  } else {
    arrDistance.sort(sortDescending);
  }

  console.log(arrDistance[0]);

  for (let i = 0; i < arrDistance.length; i += 1) {
    refObjectsArr.some((refObject) => {
      if (arrDistance[i] === refObject.distanceFromStudent) {
        sortedObjectsArr.push(refObject);
      }
      return arrDistance[i] === refObject.distanceFromStudent;
    });
  }

  return sortedObjectsArr;
};


// const sortHomes = (byAnyValue, refObjectsArr, ascending = true) => {
//   const arrByType = [];
//   const sortedObjectsArr = [];
//   refObjectsArr.forEach((refObject) => {
//     arrByType.push(refObject[byAnyValue]);
//   });
//   if (ascending) {
//     arrByType.sort(sortAscending);
//   } else {
//     arrByType.sort(sortDescending);
//   }

//   for (let i = 0; i < arrByType.length; i += 1) {
//     refObjectsArr.some((refObject) => {
//       if (arrByType[i] === refObject[byAnyValue]) {
//         sortedObjectsArr.push(refObject);
//       }
//       return arrByType[i] === refObject[byAnyValue];
//     });
//   }

//   return sortedObjectsArr;
// };

const filterHomeType = (refObjectsArr, homeType) => {
  const filteredObjectsArr = [];
  refObjectsArr.forEach((refObject) => {
    if (refObject.type === homeType) {
      filteredObjectsArr.push(refObject);
    } else {
      console.log('home type not match');
    }
  });

  return filteredObjectsArr;
};

const filterSize = (refObjectsArr, minSize, maxSize) => {
  const filteredObjectsArr = [];
  refObjectsArr.forEach((refObject) => {
    if (parseInt(refObject.size, 10) >= parseInt(minSize, 10)
      && parseInt(refObject.size, 10) <= parseInt(maxSize, 10)) {
      filteredObjectsArr.push(refObject);
    } else {
      console.log('not filtered home');
    }
  });

  console.log('SORTEDDD');
  return filteredObjectsArr;
};
const filterPrice = (refObjectsArr, minPrice, maxPrice) => {
  const filteredObjectsArr = [];
  refObjectsArr.forEach((refObject) => {
    if (parseInt(refObject.rentPrice, 10) >= parseInt(minPrice, 10)
      && parseInt(refObject.rentPrice, 10) <= parseInt(maxPrice, 10)) {
      filteredObjectsArr.push(refObject);
    } else {
      console.log('not Price filtered home');
    }
  });

  console.log('SORTEDDD in Price');
  return filteredObjectsArr;
};

const filterAll = (refObjects) => {
  const homeType = localStorage.getItem('filterRoomType');
  const minPrice = localStorage.getItem('filterPriceMin');
  const maxPrice = localStorage.getItem('filterPriceMax');

  const minSize = localStorage.getItem('filterSizeMin');
  const maxSize = localStorage.getItem('filterSizeMax');

  const minDistance = localStorage.getItem('filterDistanceMin');
  const maxDistance = localStorage.getItem('filterDistanceMax');
  let homeTypeName;

  switch (parseInt(homeType, 10)) {
    case 0:
      homeTypeName = 'nope';
      break;
    case 1:
      homeTypeName = 'Room';
      break;
    case 2:
      homeTypeName = 'Studio';
      break;
    case 3:
      homeTypeName = 'Appartment';
      break;
    default:
      homeTypeName = 'nope';
  }

  const refObjectsArr = Object.keys(refObjects).map(i => refObjects[i]);
  let filteredHomeArr = [];

  if (homeTypeName !== 'nope') {
    filteredHomeArr = filterHomeType(refObjectsArr, homeTypeName);
    console.log('filter type');
  } else {
    filteredHomeArr = refObjectsArr;
    console.log('not filter type');
  }

  if (parseInt(minPrice, 10) >= parseInt(0, 10) && parseInt(maxPrice, 10) <= parseInt(2500, 10)) {
    filteredHomeArr = filterPrice(filteredHomeArr, minPrice, maxPrice);
  }

  if (parseInt(minSize, 10) >= parseInt(0, 10) && parseInt(maxSize, 10) <= parseInt(250, 10)) {
    filteredHomeArr = filterSize(filteredHomeArr, minSize, maxSize);
  }

  if (parseFloat(minDistance) >= parseFloat(0) && parseFloat(maxDistance) <= parseFloat(250)) {
    filteredHomeArr = filterByDistance(filteredHomeArr, minDistance, maxDistance);
  }


  return filteredHomeArr;
};

export {
  filterAll,
  sortByDistance,
};
