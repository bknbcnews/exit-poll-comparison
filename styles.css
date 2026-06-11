# Data Contract

The app should consume normalized JSON. Spreadsheet layouts, NBC page layouts, manual pasted tables, and future scrapers should all be converted into this shape.

## Dataset envelope

```json
{
  "metadata": {
    "dataset_id": "2024-president-ga-draft",
    "election_id": "2024-president",
    "state": "GA",
    "year": 2024,
    "race_type": "president",
    "source": "Manual workbook import",
    "source_url": null,
    "data_status": "draft",
    "last_updated": "2026-06-11T00:00:00Z",
    "schema_version": "0.1.0"
  },
  "rows": []
}
```

## Row shape

```json
{
  "category": "Race",
  "group": "Black voters",
  "metric": "vote_share",
  "party": "Dem",
  "value": 86,
  "unit": "pct",
  "status": "ok",
  "notes": null
}
```

## Metric values

- `electorate_share`: share of electorate for a group.
- `vote_share`: candidate/party share within that group.

## Status values

- `ok`: usable numeric value.
- `missing`: expected value is absent.
- `not_available`: source reported NA/XX/XXX/--.
- `not_comparable`: group or metric definition changed.
- `draft`: value exists but is not final.

## Historical status values

- `draft`
- `under_review`
- `locked`
- `correction_pending`
- `corrected`
- `superseded`

## Correction rule

Locked historical data is not changed by normal app tools, scrapers, or election-night updates. Corrections require documentation, approval, and a new locked dataset version or correction record.
