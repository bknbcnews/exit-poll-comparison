export function rowKey(row) {
  return [row.category, row.group, row.metric, row.party || ''].join('||');
}

export function compareDatasets(current, historical) {
  const historicalMap = new Map(historical.rows.map(row => [rowKey(row), row]));
  return current.rows.map(currentRow => {
    const priorRow = historicalMap.get(rowKey(currentRow));
    const currentValue = normalizeNumber(currentRow.value);
    const priorValue = priorRow ? normalizeNumber(priorRow.value) : null;
    const change = currentValue !== null && priorValue !== null ? round1(currentValue - priorValue) : null;
    return {
      category: currentRow.category,
      group: currentRow.group,
      metric: currentRow.metric,
      party: currentRow.party || '',
      current_value: currentValue,
      prior_value: priorValue,
      change,
      direction: direction(change),
      current_status: currentRow.status || 'ok',
      prior_status: priorRow?.status || 'missing'
    };
  });
}

function normalizeNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function round1(n) {
  return Math.round(n * 10) / 10;
}

function direction(change) {
  if (change === null) return 'not_calculated';
  if (change > 0) return 'better';
  if (change < 0) return 'worse';
  return 'same';
}
