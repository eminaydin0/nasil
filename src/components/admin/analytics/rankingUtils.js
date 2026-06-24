export function sortByDesc(items, key = 'value') {
  return [...items].sort((a, b) => (b[key] ?? 0) - (a[key] ?? 0));
}

export function getShare(value, total) {
  if (!total) return 0;
  return Math.round((value / total) * 1000) / 10;
}

export function getTotal(items, key = 'value') {
  return items.reduce((sum, item) => sum + (item[key] ?? 0), 0);
}
