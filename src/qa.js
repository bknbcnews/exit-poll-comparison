export function runQa(comparisons) {
  const flags = [];
  for (const row of comparisons) {
    if (row.current_value === null) {
      flags.push(flag(row, 'missing_current', 'Current value is missing or non-numeric.'));
    }
    if (row.prior_value === null) {
      flags.push(flag(row, 'missing_prior', 'Prior value is missing or non-numeric.'));
    }
    if (row.change !== null && Math.abs(row.change) >= 15) {
      flags.push(flag(row, 'large_shift', `Large movement of ${row.change} points. Review source and group definition.`));
    }
    if (row.current_value !== null && (row.current_value < 0 || row.current_value > 100)) {
      flags.push(flag(row, 'out_of_range', 'Value is outside the expected 0-100 range.'));
    }
  }
  return flags;
}

function flag(row, code, message) {
  return {
    code,
    message,
    category: row.category,
    group: row.group,
    metric: row.metric,
    party: row.party,
    current_value: row.current_value,
    prior_value: row.prior_value,
    change: row.change
  };
}
