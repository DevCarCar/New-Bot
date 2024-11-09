function random(arr) {
  let sum = 0;
  let newArr = [];
  for (let i = 1; i <= arr.length; i++) {
    const obj = arr[i - 1];
    const key = Object.keys(obj)[0];
    const value = obj[key];
    sum += value;
    newArr[i] = { [key]: sum };
    newArr[0] = 0;
  }
  const randomNumber = Math.random();
  let result;
  for (let i = 1; i <= arr.length; i++) {
    const compare1 = Object.values(newArr[i - 1]);
    const compare2 = Object.values(newArr[i]);
    if (randomNumber > compare1 && randomNumber < compare2)
      result = Object.keys(newArr[i]);
  }
  return result;
}

module.exports = random;
