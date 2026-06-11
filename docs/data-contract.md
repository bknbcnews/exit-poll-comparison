# Data contract

Each dataset is a JSON file with `metadata` and `rows`.

Required metadata fields:

- dataset_id
- election_id
- state
- year
- race_type
- source
- data_status
- schema_version

Recommended data statuses:

- draft
- under_review
- locked
- live_unverified
- final
- corrected
- superseded

Each row should include:

- category
- group
- metric
- party
- value
- unit
- status

Example row:

```json
{
  "category": "Race",
  "group": "Black voters",
  "metric": "vote_share",
  "party": "Dem",
  "value": 86,
  "unit": "pct",
  "status": "ok"
}
```
