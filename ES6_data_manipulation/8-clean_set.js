export default function cleanSet(set, startString) {
  if (!startString) return '';

  return [...set]
    .filter((val) => val.startsWith(startString))
    .map((val) => val.slice(startString.length))
    .join('-');
}
