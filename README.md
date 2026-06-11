# Exit Poll Comparison Tool

This is a known-good static starter app for comparing current exit poll data against historical baseline data.

## How to use on GitHub Pages

1. Upload the unzipped contents of this folder to the root of a GitHub repository.
2. Make sure `index.html` is at the repo root.
3. In GitHub, go to Settings -> Pages.
4. Set source to `Deploy from a branch`, branch `main`, folder `/root`.
5. Open the GitHub Pages URL.

The starter loads these two sample files:

- `data/current/live/2024-president-ga-draft.json`
- `data/historical/draft/2020-president-ga.json`

These are sample data only. They are not final verified exit poll data.

## Data principle

- Historical data should move from `draft` to `under_review` to `locked` after verification.
- Current/live data can update frequently and should be labeled `draft`, `live_unverified`, or `final`.
- Scrapers or automated update tools should write only to `data/current/live/`, not to locked historical files.
