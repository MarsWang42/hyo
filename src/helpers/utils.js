const isEmpty = (obj) => {
  for(const key in obj) {
    if(obj.hasOwnProperty(key)) return false;
  }
  return true;
};

const Utils = {
  isEmpty,
};

export default Utils;
