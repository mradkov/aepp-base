const prefixes = [
  { name: 'Exa', magnitude: 18 },
  { name: 'Giga', magnitude: 9 },
  { name: '', magnitude: 0 },
  { name: 'Pico', magnitude: -12 },
];

const getNearestPrefix = exponent => prefixes.reduce((p, n) => (
  Math.abs(n.magnitude - exponent) < Math.abs(p.magnitude - exponent) ? n : p));

const getLowerBoundPrefix = exponent => prefixes
  .find(p => p.magnitude <= exponent) || prefixes[prefixes.length - 1];

export default (value) => {
  const { name, magnitude } = (value.e < 0 ? getNearestPrefix : getLowerBoundPrefix)(value.e);
  const v = value
    .shiftedBy(-magnitude)
    .precision(9 + Math.min(value.e - magnitude, 0))
    .toFixed();
  return `${v}${name ? ' ' : ''}${name}`;
};
