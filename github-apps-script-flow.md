# Google Apps Script Updater Flow

Preferred future automation:

1. Apps Script fetches the public NBC exit poll page or data endpoint.
2. Apps Script parses and normalizes the data into the app JSON contract.
3. Apps Script writes only to `data/current/live/` in GitHub.
4. GitHub Pages app reads the updated JSON.

## Important safety boundary

Apps Script should never write to:

```text
data/historical/locked/
```

If possible, use a GitHub token or separate repo that only has access to live/current data.

## GitHub API update pattern

To update a JSON file from Apps Script:

1. GET the file metadata from GitHub to retrieve the current SHA.
2. PUT the replacement file content with a commit message and SHA.
3. Include metadata in the JSON showing source, status, and last updated time.
