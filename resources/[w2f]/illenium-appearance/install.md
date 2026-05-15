NUI is prebuilt in `web/dist`, so no Node/npm needed for a normal install.

---

## Update — Clothing Category Compatibility Repair

**Date:** 15 May 2026

- Fixed category click reliability for Hair, Torso, Hands, Shirt, Legs, Shoes, Bags, Chains, and props.
- Added safer fallback handling for missing `componentConfig` / `propConfig` values.
- Added safer fallback handling for missing drawable/texture ranges.
- Improved FiveM NUI/CEF click reliability so tiny pointer movement is less likely to block category selection.
- Cleaned duplicate `ClothingHero.tsx` logic after compatibility repair.
- Rebuilt `web/dist` for normal server use.

### Installation / Update (normal users)

1. Download the latest release.
2. Replace your old `illenium-appearance` folder with the updated one.
3. Keep the folder name **`illenium-appearance`** (do not rename it unless you also change `ensure` and any references).
4. Confirm **`server.cfg`** contains: `ensure illenium-appearance`
5. Restart the server, or run in the server console:

   ```txt
   refresh
   restart illenium-appearance
   ```
6. If the old UI still appears, clear the FiveM client cache.
7. Test in game:
   - Hair
   - Torso
   - Hands
   - Shirt
   - Legs
   - Shoes
   - Props

### Developer Note

Normal players and server owners **do not** need Node.js, `npm install`, or `npm run build`.

Use npm **only** if you edit source files under:

`web-src/web/src/`

**Developer flow:**

```bash
cd web-src/web
npm install
npm run build
```

Build output goes to `web/dist/` (what the resource loads). After building, include the generated `web/dist` files in your fork or release so end users are not asked to compile anything.

### Troubleshooting

- **Old UI after update:** `restart illenium-appearance` and clear FiveM cache; confirm you replaced the whole resource folder, not a single file.
- **Categories missing from the menu:** check `illenium-appearance` config and permission settings (who may open shops / commands).
- **Only some categories disabled:** review `componentConfig` and `propConfig` in your framework or bridge — this fork treats missing flags more safely, but explicit `false` still disables where intended.
- **Custom fork:** if you change React/TS source, rebuild `web/dist` before deploying; uploading only `ClothingHero.tsx` (or other source) without a matching build will not update what players see.
- **Releases:** ship the rebuilt `web/dist` bundle with the resource; players load the compiled NUI, not the TypeScript source.

---

## 1. Drop the folder in

```
resources/[standalone]/illenium-appearance/
3. Save once, check that a row shows up in `playerskins` for your citizenid.
4. Walk into one of the configured shops — text-UI prompt or target option appears.

If the menu opens but nothing saves, oxmysql is starting after this resource, or the SQL files weren't imported.

---

## Rebuilding the NUI (optional)

Only if you edit `web-src/`:

```bash
cd web-src/web
npm install
npm run build
```

Output goes to `web/dist/`, which is what the game actually loads.
