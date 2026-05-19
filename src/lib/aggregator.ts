export function tryCastToNumber(value: unknown): number {
  if (value === null || value === undefined || value === '') return NaN;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value.replace(/[\s$,]/g, ''));
    return isNaN(parsed) ? NaN : parsed;
  }
  return NaN;
}

export function onlyNumbers(cellValues: unknown[]): number[] {
  return cellValues.map(tryCastToNumber).filter(n => !isNaN(n));
}

export interface AggregateResult {
  sum?: number;
  average?: number;
  count?: number;
}

export function generateValues(rawCells: unknown[]): AggregateResult {
  if (!Array.isArray(rawCells) || rawCells.length === 0) return {};

  const nums = onlyNumbers(rawCells);
  const result: AggregateResult = { count: rawCells.length };

  if (nums.length) {
    const sum = nums.reduce((a, b) => a + b, 0);
    result.sum = sum;
    result.average = Math.round((sum / nums.length) * 10000) / 10000;
  }

  return result;
}
