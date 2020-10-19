/**
 * Joins an array with "," and "and"
 * @param {Array} arr Array to be converted to a nicely formattet string of it.
 * @example
 * // 'a, b and c'
 * input = ['a', 'b', 'c']
 * joinArrNicely(input)
 * @returns {string} The input arr (Array) converted to a string with "," and "and"
 */
function joinArrNicely(arr) {
  if (arr.length === 1) return arr[0];
  const firsts = arr.slice(0, arr.length - 1);
  const last = arr[arr.length - 1];
  return firsts.join(', ') + ' and ' + last;
}

module.exports = {
  joinArrNicely: joinArrNicely
}