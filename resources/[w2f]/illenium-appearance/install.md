# Install (drag & drop)


Copy the whole **`illenium-appearance`** folder into your server:

`resources/[w2f]/illenium-appearance/`

Use the same `[w2f]` (or other) category folder you already use for W2F resources. If you put it somewhere else, use that path in step 3.

## 2. Dependencies (must be running first)

- **ox_lib**
- **oxmysql** (with MySQL configured in `server.cfg`)

No extra build step: **`web/dist` is included** — you do not need Node/npm for a normal install.

Place it after **ox_lib** and **oxmysql** (or your stack’s equivalent order).
