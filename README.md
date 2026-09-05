# Caverzasio clone

Faithful local implementation of `https://www.caverzasio.ch/`, isolated from the AndrewZellinger.com project.

## Routes

- `/` (canonical Index/home with the responsive “Product Designer” / “Designer” heading)
- `/projects`
- `/articles`
- `/history`
- `/case-studies/<slug>/` (direct project details)
- `/articles/<slug>/` (direct article details)

Legacy `/index`, `/info`, `/biography`, and `/portfolio` requests redirect permanently to `/`, `/history`, `/history`, and `/projects` respectively.

## Run locally

```bash
npm install
npm run dev
```

Production verification:

```bash
npm run build
npm run test:sites
```

## Asset policy

All retained media surfaces currently share one local Tasman Glacier photograph as a reversible stand-in; legacy project/page raster imagery remains intentionally excluded. Fonts, CSS, JavaScript, favicons, and non-raster UI chrome assets remain local. No MP4, WebM, MOV, or M4V files are included.

Projects and case-study copy is a one-time static extraction of 13 approved records from Andrew's Notion portfolio gallery. The source records live in `src/project-content.js`; their published editorial layer lives in `src/project-narratives.js` and gives every detail the same Context, Work, and Outcome structure without removing the underlying role, approach, outcome, or reflection copy. The website has no Notion runtime connection, synchronization, credentials, or client-side fetch path.

`npm run mirror` rebuilds the two source-backed route files, preserves the locally authored Articles page, updates the local asset manifest, and prunes assets no longer referenced by the retained site. It reads the captured source files at `/private/tmp/caverzasio-source-html` and is not required to run or build the checked-in clone.
