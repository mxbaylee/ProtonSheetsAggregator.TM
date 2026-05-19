import { tryCastToNumber, onlyNumbers, generateValues } from './aggregator';

describe('tryCastToNumber', () => {
  it('returns the number as-is', () => expect(tryCastToNumber(42)).toBe(42));
  it('parses a plain numeric string', () => expect(tryCastToNumber('3.14')).toBe(3.14));
  it('strips currency and comma formatting', () => expect(tryCastToNumber('$1,234.56')).toBe(1234.56));
  it('strips whitespace', () => expect(tryCastToNumber('  7  ')).toBe(7));
  it('returns NaN for text', () => expect(tryCastToNumber('hello')).toBeNaN());
  it('returns NaN for null', () => expect(tryCastToNumber(null)).toBeNaN());
  it('returns NaN for empty string', () => expect(tryCastToNumber('')).toBeNaN());
});

describe('onlyNumbers', () => {
  it('filters out non-numeric values', () => {
    expect(onlyNumbers(['1', 'foo', '2', null, '3'])).toEqual([1, 2, 3]);
  });
});

describe('generateValues', () => {
  it('returns empty object for empty array', () => expect(generateValues([])).toEqual({}));

  it('computes sum, average, count for numeric cells', () => {
    expect(generateValues(['1', '2', '3'])).toEqual({ sum: 6, average: 2, count: 3 });
  });

  it('counts all cells but only sums numbers', () => {
    expect(generateValues(['10', 'text', '20'])).toEqual({ sum: 30, average: 15, count: 3 });
  });

  it('returns only count when no numeric values', () => {
    expect(generateValues(['a', 'b'])).toEqual({ count: 2 });
  });

  it('rounds average to 4 decimal places', () => {
    const result = generateValues(['1', '2', '4']);
    expect(result.average).toBe(2.3333);
  });
});
