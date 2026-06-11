import { compareDatasets } from './compare.js';
import { runQa } from './qa.js';

const historicalSelect = document.querySelector('#historical');
const currentSelect = document.querySelector('#current');
const runButton = document.querySelector('#run');
const comparisonBody = document.querySelector('#comparison-body');
const qaBody = document.querySelector('#qa-body');
const banner = document.querySelector('#banner');

const DATASETS = {
  historical: [
    { label: 'Sample historical: 2020 President GA', path: './data/historical/draft/2020-president-ga-sample.json' }
  ],
  current: [
    { label: 'Sample current: 2024 President GA draft', path: './data/historical/draft/2024-president-ga-draft-sample.json' }
  ]
};

init();

function init() {
  populate(historicalSelect, DATASETS.historical);
  populate(currentSelect, DATASETS.current);
  runButton.addEventListener('click', runComparison);
  runComparison();
}

function populate(select, options) {
  select.innerHTML = '';
  options.forEach((item, index) => {
    const option = document.createElement('option');
    option.value = item.path;
    option.textContent = item.label;
    if (index === 0) option.selected = true;
    select.appendChild(option);
  });
}

async function loadJson(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Could not load ${path}`);
  return response.json();
}

async function runComparison() {
  const [historical, current] = await Promise.all([
    loadJson(historicalSelect.value),
    loadJson(currentSelect.value)
  ]);
  banner.textContent = `Current data status: ${current.metadata.data_status}. Historical status: ${historical.metadata.data_status}.`;
  const comparisons = compareDatasets(current, historical);
  renderComparison(comparisons);
  renderQa(runQa(comparisons));
}

function renderComparison(rows) {
  comparisonBody.innerHTML = '';
  for (const row of rows) {
    const tr = document.createElement('tr');
    tr.className = `direction-${row.direction}`;
    tr.innerHTML = `
      <td>${escapeHtml(row.category)}</td>
      <td>${escapeHtml(row.group)}</td>
      <td>${escapeHtml(row.metric)}</td>
      <td>${escapeHtml(row.party)}</td>
      <td>${formatValue(row.current_value)}</td>
      <td>${formatValue(row.prior_value)}</td>
      <td>${formatChange(row.change)}</td>
      <td>${escapeHtml(row.direction)}</td>
    `;
    comparisonBody.appendChild(tr);
  }
}

function renderQa(flags) {
  qaBody.innerHTML = '';
  if (!flags.length) {
    const tr = document.createElement('tr');
    tr.innerHTML = '<td colspan="7">No QA flags.</td>';
    qaBody.appendChild(tr);
    return;
  }
  for (const flag of flags) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escapeHtml(flag.code)}</td>
      <td>${escapeHtml(flag.category)}</td>
      <td>${escapeHtml(flag.group)}</td>
      <td>${escapeHtml(flag.metric)}</td>
      <td>${escapeHtml(flag.party)}</td>
      <td>${formatChange(flag.change)}</td>
      <td>${escapeHtml(flag.message)}</td>
    `;
    qaBody.appendChild(tr);
  }
}

function formatValue(value) {
  return value === null ? 'NA' : `${value}`;
}

function formatChange(value) {
  if (value === null) return 'NA';
  return value > 0 ? `+${value}` : `${value}`;
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[char]));
}
