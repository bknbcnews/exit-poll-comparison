const CURRENT_DATA_URL = "data/current/live/2024-president-ga-draft.json";
const HISTORICAL_DATA_URL = "data/historical/draft/2020-president-ga.json";

let currentDataset = null;
let historicalDataset = null;

async function loadJson(url) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Could not load ${url}: ${response.status}`);
  }
  return response.json();
}

function rowKey(row) {
  return [
    row.category,
    row.group,
    row.metric,
    row.party || ""
  ].join("|");
}

function formatValue(value) {
  if (value === null || value === undefined || value === "") return "";
  return `${value}`;
}

function formatChange(value) {
  if (value === null || value === undefined) return "";
  if (value > 0) return `+${value}`;
  return `${value}`;
}

function directionLabel(change) {
  if (change === null || change === undefined) return "No comparison";
  if (change > 0) return "Better";
  if (change < 0) return "Worse";
  return "Same";
}

function changeClass(change) {
  if (change === null || change === undefined) return "change-neutral";
  if (Math.abs(change) >= 15) return "change-warning";
  if (change > 0) return "change-positive";
  if (change < 0) return "change-negative";
  return "change-neutral";
}

function renderMetadata(current, historical) {
  const el = document.getElementById("metadata");
  el.innerHTML = `
    <p><strong>Current dataset:</strong> ${current.metadata.dataset_id}</p>
    <p><strong>Historical baseline:</strong> ${historical.metadata.dataset_id}</p>
    <div class="badge-row">
      <span class="badge ${current.metadata.data_status}">Current: ${current.metadata.data_status}</span>
      <span class="badge ${historical.metadata.data_status}">Historical: ${historical.metadata.data_status}</span>
      <span class="badge">State: ${current.metadata.state}</span>
      <span class="badge">Schema: ${current.metadata.schema_version}</span>
    </div>
  `;
}

function buildComparisons(current, historical) {
  const historicalByKey = new Map();
  historical.rows.forEach(row => historicalByKey.set(rowKey(row), row));

  return current.rows.map(currentRow => {
    const oldRow = historicalByKey.get(rowKey(currentRow));
    const oldValue = oldRow ? oldRow.value : null;
    const hasNumericPair = typeof currentRow.value === "number" && typeof oldValue === "number";

    return {
      ...currentRow,
      oldValue,
      change: hasNumericPair ? currentRow.value - oldValue : null,
      historicalStatus: oldRow ? oldRow.status : "missing"
    };
  });
}

function renderComparison(current, historical) {
  const el = document.getElementById("comparison-table");
  const perspective = document.getElementById("perspective-select").value;
  const rows = buildComparisons(current, historical);

  const filteredRows = perspective === "raw"
    ? rows
    : rows.filter(row => row.party === perspective || row.metric === "electorate_share");

  el.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Category</th>
          <th>Group</th>
          <th>Metric</th>
          <th>Party</th>
          <th>Current</th>
          <th>Historical</th>
          <th>Change</th>
          <th>Narrative</th>
        </tr>
      </thead>
      <tbody>
        ${filteredRows.map(row => `
          <tr>
            <td>${row.category}</td>
            <td>${row.group}</td>
            <td>${row.metric}</td>
            <td>${row.party || ""}</td>
            <td>${formatValue(row.value)}</td>
            <td>${row.oldValue === null ? "No match" : formatValue(row.oldValue)}</td>
            <td class="change-cell ${changeClass(row.change)}">${formatChange(row.change)}</td>
            <td>${directionLabel(row.change)}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function renderQa(current, historical) {
  const el = document.getElementById("qa-flags");
  const rows = buildComparisons(current, historical);
  const flags = [];

  rows.forEach(row => {
    const label = `${row.group} / ${row.metric}${row.party ? ` / ${row.party}` : ""}`;

    if (row.value === null || row.value === undefined || row.value === "") {
      flags.push(`${label}: missing current value.`);
    }

    if (typeof row.value === "number" && (row.value < 0 || row.value > 100)) {
      flags.push(`${label}: current value is outside 0-100.`);
    }

    if (row.oldValue === null || row.oldValue === undefined) {
      flags.push(`${label}: no matching historical row.`);
    }

    if (typeof row.change === "number" && Math.abs(row.change) >= 15) {
      flags.push(`${label}: large movement of ${formatChange(row.change)} points; review source and comparability.`);
    }
  });

  el.innerHTML = flags.length
    ? `<ul>${flags.map(flag => `<li>${flag}</li>`).join("")}</ul>`
    : `<p class="notice">No QA flags from basic checks.</p>`;
}

function renderAll() {
  renderMetadata(currentDataset, historicalDataset);
  renderComparison(currentDataset, historicalDataset);
  renderQa(currentDataset, historicalDataset);
}

async function init() {
  try {
    [currentDataset, historicalDataset] = await Promise.all([
      loadJson(CURRENT_DATA_URL),
      loadJson(HISTORICAL_DATA_URL)
    ]);

    document.getElementById("perspective-select").addEventListener("change", renderAll);
    renderAll();
  } catch (error) {
    document.getElementById("metadata").innerHTML = `
      <div class="notice error">
        <p><strong>Error:</strong> ${error.message}</p>
        <p>Check that the JSON files exist at the exact paths listed in <code>src/app.js</code>.</p>
      </div>
    `;
    document.getElementById("comparison-table").textContent = "Unable to load comparison.";
    document.getElementById("qa-flags").textContent = "Unable to run QA checks.";
    console.error(error);
  }
}

init();
