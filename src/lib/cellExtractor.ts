export function getSelectedRange(): string {
  const input = document.querySelector<HTMLInputElement>(
    'div[role=toolbar] + div input[type=text]'
  );
  return input ? input.value.trim() : '';
}

export function isMultiCellRange(range: string): boolean {
  return range.includes(':');
}

export async function getRawSelectedValues(): Promise<string[]> {
  const originalClipboard = await navigator.clipboard.readText().catch(() => '');

  return new Promise((resolve) => {
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      const raw = e.clipboardData?.getData('text/plain') ?? '';
      document.removeEventListener('copy', handleCopy as EventListener);

      const cells = raw
        .split(/[\t\n\r]+/)
        .map(s => s.trim())
        .filter(v => v !== '');

      resolve(cells);
    };

    document.addEventListener('copy', handleCopy as EventListener);
    document.execCommand('copy');

    // Restore whatever the user had in the clipboard before we clobbered it.
    setTimeout(() => navigator.clipboard.writeText(originalClipboard), 60);
  });
}
