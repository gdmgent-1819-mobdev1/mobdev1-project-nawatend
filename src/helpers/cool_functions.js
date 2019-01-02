function objectToArray(objects) {
  if (objects !== null) {
    return Object.keys(objects).map(i => objects[i]);
  }
  const emptyArr = [];
  return emptyArr;
}


function getValueOfElementById(id) {
  return document.getElementById(id).value;
}


export {
  objectToArray,
  getValueOfElementById,
};
