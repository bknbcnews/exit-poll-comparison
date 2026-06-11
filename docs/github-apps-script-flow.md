# Future Google Apps Script flow

Planned architecture:

1. Google Apps Script fetches data from the public NBC exit poll site.
2. Apps Script parses and normalizes the data into this repo's JSON contract.
3. Apps Script writes only to `data/current/live/` through the GitHub API.
4. GitHub Pages serves the static app and JSON data.
5. The app compares current/live JSON against historical baseline JSON.

Important rule: automated update tools should not write to `data/historical/locked/`.
