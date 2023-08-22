exports.filterObject = (obj, ...allowedProps) => {
  const updatedObj = { ...obj };

  Object.keys(updatedObj).forEach((e) => {
    if (!allowedProps.includes(e)) {
      delete updatedObj[e];
    }
  });

  return updatedObj;
};
