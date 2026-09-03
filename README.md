# ShareFridge — React prototype (v2)

Interactive prototype of **ShareFridge**, a shared-fridge coordination app for university students in shared accommodation. Built for the DECO6500 A2 Task 4 evaluation (Team 9, The University of Queensland, Semester 2 2026). SDG target 12.3 — halving food waste.

Version 2 replaces the Figma click-through prototype (v1). It is fully interactive: every item opens, every filter works, the Add Food form accepts real input, and urgency labels are computed from real dates.

## Live prototype

After deploying (see below) the prototype is served at

```
https://<your-github-username>.github.io/<repo-name>/
```

## What v2 fixes

The v1 Figma prototype was verified against TC01–TC10 and an automated walkthrough (SIM-001) on 2–3 September 2026. Every defect found is resolved here:

| v1 defect | v2 behaviour |
| --- | --- |
| DEF-01 Only Chicken Breast opened a detail view | Every item opens its own detail screen |
| DEF-02 Back navigation glitched | In-app back on every screen; the device Back button is mapped to it |
| DEF-03 Filter tabs not wired | All / Use Soon / Shared / Mine work, with live counts |
| DEF-04 Bottom navigation not interactive | Fridge / Housemates / Settings all work |
| DEF-05 Post-save confirmation (resolved in v1) | Success screen → View in Fridge, with the new item highlighted |
| DEF-06 Task-card data did not match the prototype | Free text entry — any task-card item can be added exactly as written |
| DEF-07 Category showed a blank screen | Native category picker with nine categories |
| DEF-08 Fields auto-filled as a bundle | Every field is independent; required fields are validated with inline messages |
| DEF-09 Static expiry labels drifted with the date | Urgency is computed from the real date: Use today · 1 day · 2–3 days (amber) · 4+ days (green) · Expired |

Also new: owners can edit and remove their own items (non-owners see the permission notice), search, and a facilitator reset.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
```

```bash
npm run build      # production build → dist/
npm run preview    # serve the build locally
```

Requires Node 18 or newer.

## Deploy to GitHub Pages

1. Create an empty repository on GitHub (for example `sharefridge-prototype`). Do not add a README or .gitignore there.
2. In this folder:

   ```bash
   git init
   git add .
   git commit -m "ShareFridge React prototype v2"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```

3. On GitHub open **Settings → Pages** and under *Build and deployment* set **Source** to **GitHub Actions**.
4. The workflow in `.github/workflows/deploy.yml` builds and publishes the site on every push to `main`. The first run takes about a minute; the URL is shown in the Actions run and under Settings → Pages.

The Vite base path is derived from the repository name automatically (see `vite.config.js`), so the repo can be renamed without editing any file.

## Facilitator notes

- **Reset between participants:** Settings → *Reset demo data*. The four demo items are dated relative to the reset day, so Chicken Breast always reads “Use today”, Milk “2 days left”, Carrots “5 days left”, Greek Yoghurt “7 days left”.
- **Data stays on the device.** Items are kept in the browser’s localStorage only; nothing is sent anywhere. A different browser or a private window starts from the demo set.
- **Task card T2 date:** the expiry date printed on the task card must be later than every planned session date, otherwise the saved item will (correctly) show as Expired.
- **Device:** open the URL on a phone for the most realistic session. On a laptop the app renders inside a 390 × 844 device frame.
- **Signed-in user** is Kingsley (avatar “K”), household “West End House”. Housemates: Alex, Emma, Mia.

## Project structure

```
index.html                 page shell, Google Fonts
vite.config.js             base path derived from the repo name
src/
  main.jsx                 React entry
  App.jsx                  state, in-app routing, persistence
  data.js                  household, housemates, categories, demo seed
  lib/date.js              local-date helpers, urgency thresholds, BB stamp
  lib/storage.js           localStorage wrapper
  components/              Icon, Tags (urgency / share / owner), FoodCard, ScreenHeader, BottomNav
  screens/                 Home, Detail, AddFood (add + edit), Success, Housemates, Settings
  styles.css               tokens and all component styles
.github/workflows/deploy.yml   build + deploy to GitHub Pages
```

## Design notes

- Palette: fridge-white ground with a vegetable-green accent. Urgency uses the food-safety traffic light (red / amber / green) as a separate semantic set so it never competes with the accent.
- Type: Bricolage Grotesque for titles and item names, Figtree for the interface, IBM Plex Mono for the best-before stamp (`BB 10 SEP 2026`) and counts.
- Each housemate has a fixed colour dot, the way people put a coloured sticker or a name in marker on their food in a real shared fridge.
