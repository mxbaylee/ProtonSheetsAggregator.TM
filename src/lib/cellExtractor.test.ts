import { getSelectedRange, isMultiCellRange } from './cellExtractor';

describe('getSelectedRange', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('returns empty string when element is absent', () => {
    expect(getSelectedRange()).toBe('');
  });

  it('returns trimmed value from the toolbar input', () => {
    document.body.innerHTML = `
      <div role="toolbar"></div>
      <div><input type="text" value="  A1:B3  " /></div>
    `;
    expect(getSelectedRange()).toBe('A1:B3');
  });
});

describe('isMultiCellRange', () => {
  it('returns true for a range like A1:B3', () => expect(isMultiCellRange('A1:B3')).toBe(true));
  it('returns false for a single cell like A1', () => expect(isMultiCellRange('A1')).toBe(false));
  it('returns false for empty string', () => expect(isMultiCellRange('')).toBe(false));
});
