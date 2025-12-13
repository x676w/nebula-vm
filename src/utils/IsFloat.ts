export default function isFloat(arg: number) {
  return typeof arg === "number"
    && !Number.isInteger(arg)
    && !Number.isNaN(arg);
};