# illenium-appearance — Install

W2F fork of [illenium-appearance](https://github.com/iLLeniumStudios/illenium-appearance) with a custom NUI (turntable preview, timecycle, camera rail).

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

### Why this update matters

Some servers send slightly different clothing config or component range data. The menu could work on one Qbox server but feel broken on another. This update makes the W2F UI more tolerant and stops categories from silently failing when config data is missing or incomplete.

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
```

(Or any other category you already ensure. On my own server it lives [w2f] but `[standalone]` is the normal place.

## 2. Dependencies

Must be running before this resource:

- **ox_lib** — declared in `dependencies {}`, used for callbacks, notify, textUI, zones, radial.
- **oxmysql** — `@oxmysql/lib/MySQL.lua` is loaded server-side; every DB call goes through it.
- **A framework** — `qbx_core` / `qb-core` / `es_extended`. Auto-detected, you don't pick it manually.

Optional:

- **ox_target** (or qb-target) — only if you set `Config.UseTarget = true`.
- **rcore_tattoos** — only if you set `Config.RCoreTattoosCompatibility = true`.

## 3. server.cfg

Start order matters — ox_lib, oxmysql and your framework must come up first:

```cfg
ensure ox_lib
ensure oxmysql
ensure qbx_core            # or qb-core / es_extended
ensure ox_target           # only if UseTarget = true
ensure illenium-appearance
```

Add the locale ConVar (defaults to English):

```cfg
setr illenium-appearance:locale "en"
```

Valid values match `locales/`: `ar`, `bg`, `cs`, `de`, `en`, `es-ES`, `fr`, `hu`, `id`, `it`, `nl`, `pt-BR`, `ro-RO`, `zh-CN`, `zh-TW`.

> The manifest doesn't declare `ox_lib_locale` on purpose — locales are shipped as Lua files (`locales/*.lua`), not JSON, so declaring it would just spam "missing locales/en.json" warnings.

## 4. Database

Import the four files in `sql/` (run once, all use `CREATE TABLE IF NOT EXISTS`):

| File | What it stores |
|---|---|
| `playerskins.sql` | Active appearance per character. **Required.** |
| `player_outfits.sql` | Saved named outfits. |
| `player_outfit_codes.sql` | Sharable outfit codes. |
| `management_outfits.sql` | Job/gang outfits (only if you use clothing rooms or `BossManagedOutfits`). |

The `players` table already exists from your framework — don't recreate it.

## 5. Config you'll probably want to touch

In `shared/config.lua`:

- `ClothingCost` / `BarberCost` / `TattooCost` / `SurgeonCost` — money charged per use.
- `UseTarget` — `true` only if ox_target/qb-target is running.
- `UseRadialMenu` + `UseOxRadial` — both `true` to open outfits from the ox_lib radial.
- `EnablePedMenu` + `PedMenuGroup` (default `group.admin`) — gates `/pedmenu`.
- `PersistUniforms` — keep job outfits across logout.
- `BossManagedOutfits` — let job/gang bosses manage their own outfits (needs `management_outfits`).
- `W2FPreview` — turntable + dark `superDARK` timecycle preview. Disable if you don't want it.
- `Stores` / `Blips` — defaults are stock GTA shops; trim or extend.

## 6. Verify

1. Restart the server, no missing-dependency errors in console.
2. Open the appearance menu in game (`/skin` or your framework's command).
3. Save once, check that a row shows up in `playerskins` for your citizenid.
4. Walk into one of the configured shops — text-UI prompt or target option appears.

If the menu opens but nothing saves, oxmysql is starting after this resource, or the SQL files weren't imported.
