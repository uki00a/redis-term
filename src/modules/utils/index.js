export const partitionByParity = array => [
  array.filter((_, index) => isEven(index)),
  array.filter((_, index) => isOdd(index))
];
const isEven = x => (x % 2) === 0;
const isOdd = x => !isEven(x);

export const plistToHash = plist => {
  const hash = {};
  for (let i = 0; i < plist.length; i += 2) {
    const property = plist[i];
    const value = plist[i+1];
    hash[property] = value;
  }
  return hash;
};

export const noop = () => {};
