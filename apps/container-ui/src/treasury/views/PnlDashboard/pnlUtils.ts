export const formatLocalDate = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const toCompactDate = (isoDate: string) => isoDate.replace(/-/g, '');

export const prettifyHeader = (key: string) => {
  return key
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

export const toChartDateLabel = (val: any) => {
  if (val === null || val === undefined || val === '') return '';
  const raw = typeof val === 'string' ? val.replace(/,/g, '').trim() : String(val);
  let ms = Number(raw);
  if (!Number.isFinite(ms)) return String(val);
  if (ms > 0 && ms < 100000000000) {
    ms *= 1000;
  }
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) return String(val);
  return formatLocalDate(d);
};

export const normalizeRawDate = (val: any) => toChartDateLabel(val);

export const isNumericValue = (val: any) => {
  if (val === null || val === undefined || val === '') return false;
  if (typeof val === 'number') return Number.isFinite(val);
  if (typeof val === 'string') {
    const s = val.trim();
    return /^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?$/.test(s.replace(/,/g, ''));
  }
  return false;
};

export const formatNumber = (val: any) => {
  if (val === null || val === undefined || val === '') return '';
  const raw = typeof val === 'string' ? val.replace(/,/g, '').trim() : String(val);
  const n = Number(raw);
  if (!Number.isFinite(n)) return String(val);
  return n.toLocaleString();
};

export const formatRounded = (val: any) => {
  if (val === null || val === undefined || val === '') return '';
  const n = Number(val);
  if (!Number.isFinite(n)) return String(val);
  return Math.round(n).toLocaleString();
};

export const autoSizeGridColumns = (api: any) => {
  if (!api?.getAllDisplayedColumns || api?.isDestroyed?.()) return;
  const cols = api.getAllDisplayedColumns().map((c: any) => c.getColId());
  if (cols.length > 0) {
    api.autoSizeColumns(cols, false);
  }
};
